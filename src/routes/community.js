const router = require('express').Router();
const db = require('../db');
const { authenticateToken, requireRole } = require('../middleware/auth');
const AppError = require('../utils/AppError');
const { buildQuery, requireFields, validateUUID } = require('../utils/helpers');

// =============================================
// COMMUNITY TAB (Screen 10)
// =============================================

// ── GET /api/community  (Public browsing) ─────────────
router.get('/', async (req, res, next) => {
  try {
    const { search, sort_by, order, page, limit } = req.query;

    const { query, params } = buildQuery({
      baseQuery: `SELECT p.*, u.username, u.first_name, u.last_name, u.photo_url,
                         t.title AS trip_title, t.place AS trip_place
                  FROM community_posts p
                  JOIN users u ON p.user_id = u.id
                  LEFT JOIN trips t ON p.trip_id = t.id
                  WHERE 1=1`,
      filters: [
        { field: ['p.title', 'p.content'], value: search, op: 'ILIKE' },
      ],
      sort: {
        allowedFields: ['created_at', 'likes_count', 'title'],
        field: sort_by,
        order,
        prefix: 'p',
      },
      pagination: { page, limit: limit || 50 },
    });

    const { rows } = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// ── GET /api/community/:id  (Single post) ─────────────
router.get('/:id', validateUUID('id'), async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `SELECT p.*, u.username, u.first_name, u.last_name, u.photo_url,
              t.title AS trip_title, t.place AS trip_place
       FROM community_posts p
       JOIN users u ON p.user_id = u.id
       LEFT JOIN trips t ON p.trip_id = t.id
       WHERE p.id = $1`,
      [req.params.id]
    );

    if (rows.length === 0) throw AppError.notFound('Post not found');
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// ── POST /api/community  (Auth required) ──────────────
router.post('/',
  authenticateToken,
  requireRole('user', 'admin'),
  requireFields('title', 'content'),
  async (req, res, next) => {
    try {
      const { title, content, trip_id, tags } = req.body;

      const { rows } = await db.query(
        `INSERT INTO community_posts (user_id, trip_id, title, content, tags)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [req.user.id, trip_id || null, title, content, tags || []]
      );

      res.status(201).json(rows[0]);
    } catch (err) {
      next(err);
    }
  }
);

// ── PUT /api/community/:id  (Edit own post) ───────────
router.put('/:id', authenticateToken, validateUUID('id'), async (req, res, next) => {
  try {
    const { title, content, tags } = req.body;

    const { rows } = await db.query(
      `UPDATE community_posts SET
         title   = COALESCE($1, title),
         content = COALESCE($2, content),
         tags    = COALESCE($3, tags),
         updated_at = NOW()
       WHERE id = $4 AND user_id = $5
       RETURNING *`,
      [title, content, tags, req.params.id, req.user.id]
    );

    if (rows.length === 0) throw AppError.forbidden('Access denied or post not found');
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// ── DELETE /api/community/:id  (Own post or admin) ────
router.delete('/:id', authenticateToken, validateUUID('id'), async (req, res, next) => {
  try {
    // Admins can delete any post; users only their own
    const isAdmin = req.user.role === 'admin';
    const query = isAdmin
      ? 'DELETE FROM community_posts WHERE id = $1 RETURNING id'
      : 'DELETE FROM community_posts WHERE id = $1 AND user_id = $2 RETURNING id';
    const params = isAdmin ? [req.params.id] : [req.params.id, req.user.id];

    const { rows } = await db.query(query, params);
    if (rows.length === 0) throw AppError.forbidden('Access denied or post not found');
    res.json({ message: 'Post deleted' });
  } catch (err) {
    next(err);
  }
});

// ── POST /api/community/:id/like  (Toggle) ────────────
router.post('/:id/like', authenticateToken, validateUUID('id'), async (req, res, next) => {
  try {
    // Use a transaction to keep likes_count in sync
    const result = await db.transaction(async (client) => {
      const existing = await client.query(
        'SELECT id FROM community_likes WHERE post_id = $1 AND user_id = $2',
        [req.params.id, req.user.id]
      );

      if (existing.rows.length > 0) {
        await client.query('DELETE FROM community_likes WHERE id = $1', [existing.rows[0].id]);
        await client.query(
          'UPDATE community_posts SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = $1',
          [req.params.id]
        );
        return 'unliked';
      } else {
        await client.query(
          'INSERT INTO community_likes (post_id, user_id) VALUES ($1, $2)',
          [req.params.id, req.user.id]
        );
        await client.query(
          'UPDATE community_posts SET likes_count = likes_count + 1 WHERE id = $1',
          [req.params.id]
        );
        return 'liked';
      }
    });

    res.json({ action: result });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

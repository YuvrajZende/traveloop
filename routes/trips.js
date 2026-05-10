const router = require('express').Router();
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');
const AppError = require('../utils/AppError');
const { buildQuery, requireFields, validateUUID } = require('../utils/helpers');

// ── POST /api/trips  (Screen 4 — create a new trip) ───
router.post('/',
  authenticateToken,
  requireFields('title', 'place', 'start_date', 'end_date'),
  async (req, res, next) => {
    try {
      const { title, description, place, start_date, end_date, total_budget, cover_image_url, is_preplanned } = req.body;

      const { rows } = await db.query(
        `INSERT INTO trips
          (user_id, title, description, place, start_date, end_date, total_budget, cover_image_url, is_preplanned)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
         RETURNING *`,
        [req.user.id, title, description, place, start_date, end_date, total_budget, cover_image_url, is_preplanned || false]
      );

      res.status(201).json(rows[0]);
    } catch (err) {
      next(err);
    }
  }
);

// ── GET /api/trips  (Screen 6 — user trip listing) ────
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const { status, search, sort_by, order, page, limit } = req.query;

    const { query, params } = buildQuery({
      baseQuery: 'SELECT * FROM trips WHERE user_id = $1',
      baseParams: [req.user.id],
      filters: [
        { field: 'status', value: status },
        { field: ['title', 'place'], value: search, op: 'ILIKE' },
      ],
      sort: {
        allowedFields: ['created_at', 'start_date', 'end_date', 'title', 'place'],
        field: sort_by,
        order,
      },
      pagination: { page, limit },
    });

    const { rows } = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// ── GET /api/trips/:id  (Single trip detail) ──────────
router.get('/:id', authenticateToken, validateUUID('id'), async (req, res, next) => {
  try {
    const { rows } = await db.query(
      'SELECT * FROM trips WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );

    if (rows.length === 0) throw AppError.notFound('Trip not found');
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// ── PUT /api/trips/:id  (Update trip) ─────────────────
router.put('/:id', authenticateToken, validateUUID('id'), async (req, res, next) => {
  try {
    const { title, description, place, start_date, end_date, total_budget, cover_image_url, status, is_preplanned } = req.body;

    const { rows } = await db.query(
      `UPDATE trips SET
         title           = COALESCE($1, title),
         description     = COALESCE($2, description),
         place           = COALESCE($3, place),
         start_date      = COALESCE($4, start_date),
         end_date        = COALESCE($5, end_date),
         total_budget    = COALESCE($6, total_budget),
         cover_image_url = COALESCE($7, cover_image_url),
         status          = COALESCE($8, status),
         is_preplanned   = COALESCE($9, is_preplanned),
         updated_at      = NOW()
       WHERE id = $10 AND user_id = $11
       RETURNING *`,
      [title, description, place, start_date, end_date, total_budget,
       cover_image_url, status, is_preplanned, req.params.id, req.user.id]
    );

    if (rows.length === 0) throw AppError.notFound('Trip not found');
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// ── DELETE /api/trips/:id ─────────────────────────────
router.delete('/:id', authenticateToken, validateUUID('id'), async (req, res, next) => {
  try {
    const { rows } = await db.query(
      'DELETE FROM trips WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user.id]
    );

    if (rows.length === 0) throw AppError.notFound('Trip not found');
    res.json({ message: 'Trip deleted successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

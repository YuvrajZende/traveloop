const router = require('express').Router();
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');
const AppError = require('../utils/AppError');
const { buildQuery, requireFields, validateUUID } = require('../utils/helpers');

// =============================================
// TRIP NOTES / JOURNAL (Screen 13)
// =============================================

// ── GET /api/notes/:tripId ────────────────────────────
router.get('/:tripId', authenticateToken, validateUUID('tripId'), async (req, res, next) => {
  try {
    const { search, filter, day, sort_by, order, page, limit } = req.query;

    const filters = [
      { field: ['n.title', 'n.content'], value: search, op: 'ILIKE' },
    ];

    if (filter === 'by_day' && day) {
      filters.push({ field: 'n.day_number', value: parseInt(day) });
    }

    const { query, params } = buildQuery({
      baseQuery: `SELECT n.*, u.first_name, u.last_name
                  FROM trip_notes n
                  JOIN users u ON n.user_id = u.id
                  WHERE n.trip_id = $1`,
      baseParams: [req.params.tripId],
      filters,
      sort: {
        allowedFields: ['created_at', 'note_date', 'day_number', 'title'],
        field: sort_by,
        order,
        prefix: 'n',
      },
      pagination: { page, limit },
    });

    const { rows } = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// ── POST /api/notes ───────────────────────────────────
router.post('/',
  authenticateToken,
  requireFields('trip_id', 'title', 'content'),
  async (req, res, next) => {
    try {
      const { trip_id, title, content, day_number, note_date, tags } = req.body;

      // Verify trip exists
      const trip = await db.query('SELECT id FROM trips WHERE id = $1', [trip_id]);
      if (trip.rows.length === 0) throw AppError.notFound('Trip not found');

      const { rows } = await db.query(
        `INSERT INTO trip_notes
          (trip_id, user_id, title, content, day_number, note_date, tags)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [trip_id, req.user.id, title, content, day_number, note_date, tags || []]
      );

      res.status(201).json(rows[0]);
    } catch (err) {
      next(err);
    }
  }
);

// ── PUT /api/notes/:id ────────────────────────────────
router.put('/:id', authenticateToken, validateUUID('id'), async (req, res, next) => {
  try {
    const { title, content, day_number, note_date, tags } = req.body;

    const { rows } = await db.query(
      `UPDATE trip_notes SET
         title      = COALESCE($1, title),
         content    = COALESCE($2, content),
         day_number = COALESCE($3, day_number),
         note_date  = COALESCE($4, note_date),
         tags       = COALESCE($5, tags),
         updated_at = NOW()
       WHERE id = $6 AND user_id = $7
       RETURNING *`,
      [title, content, day_number, note_date, tags, req.params.id, req.user.id]
    );

    if (rows.length === 0) throw AppError.forbidden('Note not found or access denied');
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// ── DELETE /api/notes/:id ─────────────────────────────
router.delete('/:id', authenticateToken, validateUUID('id'), async (req, res, next) => {
  try {
    const { rows } = await db.query(
      'DELETE FROM trip_notes WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user.id]
    );

    if (rows.length === 0) throw AppError.forbidden('Note not found or access denied');
    res.json({ message: 'Note deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

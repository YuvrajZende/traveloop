const router = require('express').Router();
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');
const AppError = require('../utils/AppError');
const { requireFields, validateUUID } = require('../utils/helpers');

// =============================================
// PACKING CHECKLIST (Screen 11)
// =============================================

// ── GET /api/checklist/:tripId  (Full checklist + progress) ──
router.get('/:tripId', authenticateToken, validateUUID('tripId'), async (req, res, next) => {
  try {
    const [categories, totals] = await Promise.all([
      db.query(
        `SELECT c.*,
           COALESCE(json_agg(
             json_build_object(
               'id', i.id, 'name', i.name,
               'is_packed', i.is_packed, 'sort_order', i.sort_order
             ) ORDER BY i.sort_order
           ) FILTER (WHERE i.id IS NOT NULL), '[]') AS items
         FROM checklist_categories c
         LEFT JOIN checklist_items i ON i.category_id = c.id
         WHERE c.trip_id = $1
         GROUP BY c.id
         ORDER BY c.sort_order`,
        [req.params.tripId]
      ),
      db.query(
        `SELECT
           COUNT(i.id)::int AS total_items,
           COUNT(i.id) FILTER (WHERE i.is_packed = true)::int AS packed_items
         FROM checklist_items i
         JOIN checklist_categories c ON i.category_id = c.id
         WHERE c.trip_id = $1`,
        [req.params.tripId]
      ),
    ]);

    res.json({
      categories: categories.rows,
      progress: totals.rows[0],
    });
  } catch (err) {
    next(err);
  }
});

// ── POST /api/checklist/categories ────────────────────
router.post('/categories',
  authenticateToken,
  requireFields('trip_id', 'name'),
  async (req, res, next) => {
    try {
      const { trip_id, name, sort_order } = req.body;

      const { rows } = await db.query(
        `INSERT INTO checklist_categories (trip_id, name, sort_order)
         VALUES ($1, $2, $3) RETURNING *`,
        [trip_id, name, sort_order || 0]
      );

      res.status(201).json(rows[0]);
    } catch (err) {
      next(err);
    }
  }
);

// ── POST /api/checklist/items ─────────────────────────
router.post('/items',
  authenticateToken,
  requireFields('category_id', 'name'),
  async (req, res, next) => {
    try {
      const { category_id, name, sort_order } = req.body;

      const { rows } = await db.query(
        `INSERT INTO checklist_items (category_id, name, sort_order)
         VALUES ($1, $2, $3) RETURNING *`,
        [category_id, name, sort_order || 0]
      );

      res.status(201).json(rows[0]);
    } catch (err) {
      next(err);
    }
  }
);

// ── PATCH /api/checklist/items/:id/toggle ─────────────
router.patch('/items/:id/toggle', authenticateToken, validateUUID('id'), async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `UPDATE checklist_items SET is_packed = NOT is_packed
       WHERE id = $1 RETURNING *`,
      [req.params.id]
    );

    if (rows.length === 0) throw AppError.notFound('Item not found');
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// ── POST /api/checklist/:tripId/reset ─────────────────
router.post('/:tripId/reset', authenticateToken, validateUUID('tripId'), async (req, res, next) => {
  try {
    await db.query(
      `UPDATE checklist_items SET is_packed = false
       WHERE category_id IN (
         SELECT id FROM checklist_categories WHERE trip_id = $1
       )`,
      [req.params.tripId]
    );
    res.json({ message: 'Checklist reset' });
  } catch (err) {
    next(err);
  }
});

// ── DELETE /api/checklist/items/:id ───────────────────
router.delete('/items/:id', authenticateToken, validateUUID('id'), async (req, res, next) => {
  try {
    const { rows } = await db.query(
      'DELETE FROM checklist_items WHERE id = $1 RETURNING id',
      [req.params.id]
    );
    if (rows.length === 0) throw AppError.notFound('Item not found');
    res.json({ message: 'Item deleted' });
  } catch (err) {
    next(err);
  }
});

// ── DELETE /api/checklist/categories/:id ──────────────
router.delete('/categories/:id', authenticateToken, validateUUID('id'), async (req, res, next) => {
  try {
    const { rows } = await db.query(
      'DELETE FROM checklist_categories WHERE id = $1 RETURNING id',
      [req.params.id]
    );
    if (rows.length === 0) throw AppError.notFound('Category not found');
    res.json({ message: 'Category deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

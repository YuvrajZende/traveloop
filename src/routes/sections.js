const express = require('express');
const { body } = require('express-validator');
const { query, getClient } = require('../config/db');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/errorHandler');

const router = express.Router({ mergeParams: true }); // access :tripId from parent

// Helper: verify trip belongs to user
const verifyTripOwner = async (tripId, userId) => {
  const result = await query(
    'SELECT id FROM trips WHERE id = $1 AND user_id = $2',
    [tripId, userId]
  );
  return result.rows.length > 0;
};

// ── GET /api/trips/:tripId/sections ───────────────────────
// Get all sections for a trip (Screen 5)
router.get('/', authenticate, async (req, res, next) => {
  try {
    const { tripId } = req.params;

    if (!(await verifyTripOwner(tripId, req.user.id))) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    const result = await query(
      `SELECT * FROM itinerary_sections
       WHERE trip_id = $1 ORDER BY order_index ASC`,
      [tripId]
    );

    const totalBudget = result.rows.reduce((sum, s) => sum + parseFloat(s.budget || 0), 0);

    res.json({
      success: true,
      data: { sections: result.rows, total_budget: totalBudget },
    });
  } catch (err) {
    next(err);
  }
});

// ── POST /api/trips/:tripId/sections ──────────────────────
// Add a new section (Screen 5: "Add another Section")
router.post(
  '/',
  authenticate,
  [
    body('title').trim().notEmpty().withMessage('Section title is required'),
    body('description').optional().trim(),
    body('start_date').optional().isISO8601().withMessage('Valid start date required'),
    body('end_date').optional().isISO8601().withMessage('Valid end date required'),
    body('budget').optional().isFloat({ min: 0 }),
    body('type').optional().isIn(['travel', 'hotel', 'activity', 'food', 'general']),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { tripId } = req.params;

      if (!(await verifyTripOwner(tripId, req.user.id))) {
        return res.status(404).json({ success: false, message: 'Trip not found' });
      }

      // Get next order index
      const countResult = await query(
        'SELECT COALESCE(MAX(order_index), -1) + 1 AS next_index FROM itinerary_sections WHERE trip_id = $1',
        [tripId]
      );
      const order_index = countResult.rows[0].next_index;

      const { title, description, start_date, end_date, budget, type } = req.body;

      const result = await query(
        `INSERT INTO itinerary_sections
           (trip_id, title, description, start_date, end_date, budget, order_index, type)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [tripId, title, description || null, start_date || null, end_date || null, budget || 0, order_index, type || 'general']
      );

      res.status(201).json({
        success: true,
        message: 'Section added',
        data: { section: result.rows[0] },
      });
    } catch (err) {
      next(err);
    }
  }
);

// ── PUT /api/trips/:tripId/sections/:sectionId ────────────
// Update a section (Screen 5: edit section details)
router.put(
  '/:sectionId',
  authenticate,
  [
    body('title').optional().trim().notEmpty(),
    body('description').optional().trim(),
    body('start_date').optional().isISO8601(),
    body('end_date').optional().isISO8601(),
    body('budget').optional().isFloat({ min: 0 }),
    body('type').optional().isIn(['travel', 'hotel', 'activity', 'food', 'general']),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { tripId, sectionId } = req.params;

      if (!(await verifyTripOwner(tripId, req.user.id))) {
        return res.status(404).json({ success: false, message: 'Trip not found' });
      }

      const { title, description, start_date, end_date, budget, type } = req.body;

      const result = await query(
        `UPDATE itinerary_sections
         SET title       = COALESCE($1, title),
             description = COALESCE($2, description),
             start_date  = COALESCE($3, start_date),
             end_date    = COALESCE($4, end_date),
             budget      = COALESCE($5, budget),
             type        = COALESCE($6, type)
         WHERE id = $7 AND trip_id = $8
         RETURNING *`,
        [title, description, start_date, end_date, budget, type, sectionId, tripId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Section not found' });
      }

      res.json({ success: true, data: { section: result.rows[0] } });
    } catch (err) {
      next(err);
    }
  }
);

// ── PATCH /api/trips/:tripId/sections/reorder ─────────────
// Reorder sections drag-and-drop (Screen 5)
router.patch('/reorder', authenticate, async (req, res, next) => {
  const client = await getClient();
  try {
    const { tripId } = req.params;
    const { order } = req.body; // [{ id: uuid, order_index: number }, ...]

    if (!Array.isArray(order)) {
      return res.status(400).json({ success: false, message: 'order must be an array' });
    }

    if (!(await verifyTripOwner(tripId, req.user.id))) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    await client.query('BEGIN');
    for (const item of order) {
      await client.query(
        'UPDATE itinerary_sections SET order_index = $1 WHERE id = $2 AND trip_id = $3',
        [item.order_index, item.id, tripId]
      );
    }
    await client.query('COMMIT');

    res.json({ success: true, message: 'Sections reordered' });
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
});

// ── DELETE /api/trips/:tripId/sections/:sectionId ─────────
router.delete('/:sectionId', authenticate, async (req, res, next) => {
  try {
    const { tripId, sectionId } = req.params;

    if (!(await verifyTripOwner(tripId, req.user.id))) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    const result = await query(
      'DELETE FROM itinerary_sections WHERE id = $1 AND trip_id = $2 RETURNING id',
      [sectionId, tripId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Section not found' });
    }

    res.json({ success: true, message: 'Section deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

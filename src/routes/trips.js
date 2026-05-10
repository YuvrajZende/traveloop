const express = require('express');
const { body, query: queryValidator } = require('express-validator');
const { query, getClient } = require('../config/db');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/errorHandler');

const router = express.Router();

// ── GET /api/trips ────────────────────────────────────────
// All trips for logged-in user (Screen 3: "Previous Trips" section)
router.get('/', authenticate, async (req, res, next) => {
  try {
    const { status, search, sort = 'created_at', order = 'DESC', limit = 10, offset = 0 } = req.query;

    const allowedSorts = ['created_at', 'start_date', 'end_date', 'title'];
    const sortCol = allowedSorts.includes(sort) ? sort : 'created_at';
    const sortDir = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    let sql = `SELECT t.id, t.title, t.destination, t.start_date, t.end_date,
                      t.total_budget, t.status, t.cover_image, t.created_at,
                      COUNT(s.id) AS section_count
               FROM trips t
               LEFT JOIN itinerary_sections s ON s.trip_id = t.id
               WHERE t.user_id = $1`;
    const params = [req.user.id];

    if (status) {
      params.push(status);
      sql += ` AND t.status = $${params.length}`;
    }
    if (search) {
      params.push(`%${search}%`);
      sql += ` AND (t.title ILIKE $${params.length} OR t.destination ILIKE $${params.length})`;
    }

    sql += ` GROUP BY t.id ORDER BY t.${sortCol} ${sortDir}`;
    params.push(parseInt(limit), parseInt(offset));
    sql += ` LIMIT $${params.length - 1} OFFSET $${params.length}`;

    const result = await query(sql, params);

    // Count total
    const countResult = await query(
      `SELECT COUNT(*) FROM trips WHERE user_id = $1 ${status ? 'AND status = $2' : ''}`,
      status ? [req.user.id, status] : [req.user.id]
    );

    res.json({
      success: true,
      data: {
        trips: result.rows,
        total: parseInt(countResult.rows[0].count),
      },
    });
  } catch (err) {
    next(err);
  }
});

// ── POST /api/trips ───────────────────────────────────────
// Create a new trip (Screen 4: Create a New Trip)
router.post(
  '/',
  authenticate,
  [
    body('title').trim().notEmpty().withMessage('Trip title is required'),
    body('destination').trim().notEmpty().withMessage('Destination is required'),
    body('start_date').isISO8601().withMessage('Valid start date required (YYYY-MM-DD)'),
    body('end_date').isISO8601().withMessage('Valid end date required (YYYY-MM-DD)')
      .custom((end, { req }) => {
        if (new Date(end) <= new Date(req.body.start_date)) {
          throw new Error('End date must be after start date');
        }
        return true;
      }),
    body('total_budget').optional().isFloat({ min: 0 }).withMessage('Budget must be a positive number'),
    body('notes').optional().trim(),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { title, destination, start_date, end_date, total_budget, notes, cover_image } = req.body;

      const result = await query(
        `INSERT INTO trips (user_id, title, destination, start_date, end_date, total_budget, notes, cover_image)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [req.user.id, title, destination, start_date, end_date, total_budget || 0, notes || null, cover_image || null]
      );

      res.status(201).json({
        success: true,
        message: 'Trip created successfully',
        data: { trip: result.rows[0] },
      });
    } catch (err) {
      next(err);
    }
  }
);

// ── GET /api/trips/:id ────────────────────────────────────
// Trip details with all sections (Screen 5: Build Itinerary)
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const tripResult = await query(
      `SELECT * FROM trips WHERE id = $1 AND user_id = $2`,
      [req.params.id, req.user.id]
    );

    if (tripResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    const sectionsResult = await query(
      `SELECT * FROM itinerary_sections
       WHERE trip_id = $1 ORDER BY order_index ASC`,
      [req.params.id]
    );

    res.json({
      success: true,
      data: {
        trip: tripResult.rows[0],
        sections: sectionsResult.rows,
      },
    });
  } catch (err) {
    next(err);
  }
});

// ── PUT /api/trips/:id ────────────────────────────────────
router.put(
  '/:id',
  authenticate,
  [
    body('title').optional().trim().notEmpty(),
    body('destination').optional().trim().notEmpty(),
    body('start_date').optional().isISO8601(),
    body('end_date').optional().isISO8601(),
    body('total_budget').optional().isFloat({ min: 0 }),
    body('status').optional().isIn(['upcoming', 'ongoing', 'completed', 'cancelled']),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { title, destination, start_date, end_date, total_budget, status, notes, cover_image } = req.body;

      const result = await query(
        `UPDATE trips
         SET title        = COALESCE($1, title),
             destination  = COALESCE($2, destination),
             start_date   = COALESCE($3, start_date),
             end_date     = COALESCE($4, end_date),
             total_budget = COALESCE($5, total_budget),
             status       = COALESCE($6, status),
             notes        = COALESCE($7, notes),
             cover_image  = COALESCE($8, cover_image)
         WHERE id = $9 AND user_id = $10
         RETURNING *`,
        [title, destination, start_date, end_date, total_budget, status, notes, cover_image, req.params.id, req.user.id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Trip not found' });
      }

      res.json({ success: true, data: { trip: result.rows[0] } });
    } catch (err) {
      next(err);
    }
  }
);

// ── DELETE /api/trips/:id ─────────────────────────────────
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const result = await query(
      'DELETE FROM trips WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    res.json({ success: true, message: 'Trip deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

const router = require('express').Router();
const db = require('../db');
const { authenticateToken, requireTripOwner } = require('../middleware/auth');
const AppError = require('../utils/AppError');
const { requireFields, validateUUID } = require('../utils/helpers');

// =============================================
// ITINERARY SECTIONS (Screen 5)
// =============================================

// ── POST /api/itinerary/sections ──────────────────────
router.post('/sections',
  authenticateToken,
  requireFields('trip_id', 'section_number', 'title'),
  async (req, res, next) => {
    try {
      const { trip_id, section_number, title, description, start_date, end_date, budget } = req.body;

      // Verify ownership
      const trip = await db.query('SELECT id FROM trips WHERE id = $1 AND user_id = $2', [trip_id, req.user.id]);
      if (trip.rows.length === 0) throw AppError.notFound('Trip not found');

      const { rows } = await db.query(
        `INSERT INTO itinerary_sections
          (trip_id, section_number, title, description, start_date, end_date, budget)
         VALUES ($1,$2,$3,$4,$5,$6,$7)
         RETURNING *`,
        [trip_id, section_number, title, description, start_date, end_date, budget]
      );

      res.status(201).json(rows[0]);
    } catch (err) {
      next(err);
    }
  }
);

// ── GET /api/itinerary/sections/:tripId ───────────────
router.get('/sections/:tripId', authenticateToken, validateUUID('tripId'), async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `SELECT s.* FROM itinerary_sections s
       JOIN trips t ON s.trip_id = t.id
       WHERE s.trip_id = $1 AND t.user_id = $2
       ORDER BY s.section_number ASC`,
      [req.params.tripId, req.user.id]
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// ── PUT /api/itinerary/sections/:id ───────────────────
router.put('/sections/:id', authenticateToken, validateUUID('id'), async (req, res, next) => {
  try {
    const { title, description, start_date, end_date, budget, section_number } = req.body;

    const { rows } = await db.query(
      `UPDATE itinerary_sections SET
         title          = COALESCE($1, title),
         description    = COALESCE($2, description),
         start_date     = COALESCE($3, start_date),
         end_date       = COALESCE($4, end_date),
         budget         = COALESCE($5, budget),
         section_number = COALESCE($6, section_number),
         updated_at     = NOW()
       WHERE id = $7
       RETURNING *`,
      [title, description, start_date, end_date, budget, section_number, req.params.id]
    );

    if (rows.length === 0) throw AppError.notFound('Section not found');
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// ── DELETE /api/itinerary/sections/:id ────────────────
router.delete('/sections/:id', authenticateToken, validateUUID('id'), async (req, res, next) => {
  try {
    const { rows } = await db.query(
      'DELETE FROM itinerary_sections WHERE id = $1 RETURNING id',
      [req.params.id]
    );
    if (rows.length === 0) throw AppError.notFound('Section not found');
    res.json({ message: 'Section deleted' });
  } catch (err) {
    next(err);
  }
});

// =============================================
// ACTIVITIES within sections (Screen 4 & 5)
// =============================================

// ── POST /api/itinerary/activities ────────────────────
router.post('/activities',
  authenticateToken,
  requireFields('section_id', 'name'),
  async (req, res, next) => {
    try {
      const { section_id, name, description, location, activity_type, estimated_cost, start_time, end_time } = req.body;

      const { rows } = await db.query(
        `INSERT INTO activities
          (section_id, name, description, location, activity_type, estimated_cost, start_time, end_time)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
         RETURNING *`,
        [section_id, name, description, location, activity_type, estimated_cost, start_time, end_time]
      );

      res.status(201).json(rows[0]);
    } catch (err) {
      next(err);
    }
  }
);

// ── GET /api/itinerary/activities/:sectionId ──────────
router.get('/activities/:sectionId', authenticateToken, validateUUID('sectionId'), async (req, res, next) => {
  try {
    const { rows } = await db.query(
      'SELECT * FROM activities WHERE section_id = $1 ORDER BY start_time ASC',
      [req.params.sectionId]
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// ── DELETE /api/itinerary/activities/:id ───────────────
router.delete('/activities/:id', authenticateToken, validateUUID('id'), async (req, res, next) => {
  try {
    const { rows } = await db.query(
      'DELETE FROM activities WHERE id = $1 RETURNING id',
      [req.params.id]
    );
    if (rows.length === 0) throw AppError.notFound('Activity not found');
    res.json({ message: 'Activity deleted' });
  } catch (err) {
    next(err);
  }
});

// =============================================
// ITINERARY DAY VIEW with EXPENSES (Screen 9)
// =============================================

// ── GET /api/itinerary/days/:sectionId ────────────────
router.get('/days/:sectionId', authenticateToken, validateUUID('sectionId'), async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `SELECT d.*,
              COALESCE(SUM(da.expense), 0)::numeric AS total_expense,
              COUNT(da.id)::int AS activity_count
       FROM itinerary_days d
       LEFT JOIN day_activities da ON da.day_id = d.id
       WHERE d.section_id = $1
       GROUP BY d.id
       ORDER BY d.day_number ASC`,
      [req.params.sectionId]
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// ── POST /api/itinerary/days ──────────────────────────
router.post('/days',
  authenticateToken,
  requireFields('section_id', 'day_number'),
  async (req, res, next) => {
    try {
      const { section_id, day_number, day_date } = req.body;

      const { rows } = await db.query(
        `INSERT INTO itinerary_days (section_id, day_number, day_date)
         VALUES ($1, $2, $3) RETURNING *`,
        [section_id, day_number, day_date]
      );
      res.status(201).json(rows[0]);
    } catch (err) {
      next(err);
    }
  }
);

// ── DELETE /api/itinerary/days/:id ────────────────────
router.delete('/days/:id', authenticateToken, validateUUID('id'), async (req, res, next) => {
  try {
    const { rows } = await db.query(
      'DELETE FROM itinerary_days WHERE id = $1 RETURNING id',
      [req.params.id]
    );
    if (rows.length === 0) throw AppError.notFound('Day not found');
    res.json({ message: 'Day deleted' });
  } catch (err) {
    next(err);
  }
});

// ── GET /api/itinerary/day-activities/:dayId ──────────
router.get('/day-activities/:dayId', authenticateToken, validateUUID('dayId'), async (req, res, next) => {
  try {
    const { rows } = await db.query(
      'SELECT * FROM day_activities WHERE day_id = $1 ORDER BY sort_order ASC',
      [req.params.dayId]
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// ── POST /api/itinerary/day-activities ────────────────
router.post('/day-activities',
  authenticateToken,
  requireFields('day_id', 'name'),
  async (req, res, next) => {
    try {
      const { day_id, name, description, activity_type, expense, sort_order } = req.body;

      const { rows } = await db.query(
        `INSERT INTO day_activities (day_id, name, description, activity_type, expense, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [day_id, name, description, activity_type || 'other', expense || 0, sort_order || 0]
      );
      res.status(201).json(rows[0]);
    } catch (err) {
      next(err);
    }
  }
);

// ── DELETE /api/itinerary/day-activities/:id ───────────
router.delete('/day-activities/:id', authenticateToken, validateUUID('id'), async (req, res, next) => {
  try {
    const { rows } = await db.query(
      'DELETE FROM day_activities WHERE id = $1 RETURNING id',
      [req.params.id]
    );
    if (rows.length === 0) throw AppError.notFound('Day activity not found');
    res.json({ message: 'Day activity deleted' });
  } catch (err) {
    next(err);
  }
});

// =============================================
// REORDER ENDPOINTS (Screen 5/6)
// =============================================

// ── PATCH /api/itinerary/sections/reorder ─────────────
// Body: { trip_id, order: [{ id, section_number }, ...] }
router.patch('/sections/reorder', authenticateToken, async (req, res, next) => {
  try {
    const { trip_id, order } = req.body;

    if (!Array.isArray(order) || order.length === 0) {
      throw AppError.badRequest('order must be a non-empty array');
    }

    await db.transaction(async (client) => {
      for (const item of order) {
        await client.query(
          'UPDATE itinerary_sections SET section_number = $1, updated_at = NOW() WHERE id = $2 AND trip_id = $3',
          [item.section_number, item.id, trip_id]
        );
      }
    });

    res.json({ message: 'Sections reordered' });
  } catch (err) {
    next(err);
  }
});

// ── PATCH /api/itinerary/activities/reorder ────────────
// Body: { section_id, order: [{ id, start_time }, ...] }
router.patch('/activities/reorder', authenticateToken, async (req, res, next) => {
  try {
    const { section_id, order } = req.body;

    if (!Array.isArray(order) || order.length === 0) {
      throw AppError.badRequest('order must be a non-empty array');
    }

    await db.transaction(async (client) => {
      for (const item of order) {
        await client.query(
          'UPDATE activities SET start_time = $1 WHERE id = $2 AND section_id = $3',
          [item.start_time, item.id, section_id]
        );
      }
    });

    res.json({ message: 'Activities reordered' });
  } catch (err) {
    next(err);
  }
});

// =============================================
// FULL ITINERARY VIEW (Screen 6 — calendar/timeline)
// =============================================

// ── GET /api/itinerary/view/:tripId ───────────────────
// Returns the complete structured itinerary payload
router.get('/view/:tripId', authenticateToken, validateUUID('tripId'), async (req, res, next) => {
  try {
    const [tripRes, sectionsRes, daysRes] = await Promise.all([
      db.query(
        'SELECT id, title, place, start_date, end_date, total_budget, status FROM trips WHERE id = $1 AND user_id = $2',
        [req.params.tripId, req.user.id]
      ),
      db.query(
        `SELECT s.*,
                COALESCE(json_agg(
                  json_build_object(
                    'id', a.id, 'name', a.name, 'description', a.description,
                    'location', a.location, 'activity_type', a.activity_type,
                    'estimated_cost', a.estimated_cost,
                    'start_time', a.start_time, 'end_time', a.end_time
                  ) ORDER BY a.start_time
                ) FILTER (WHERE a.id IS NOT NULL), '[]') AS activities
         FROM itinerary_sections s
         LEFT JOIN activities a ON a.section_id = s.id
         WHERE s.trip_id = $1
         GROUP BY s.id
         ORDER BY s.section_number ASC`,
        [req.params.tripId]
      ),
      db.query(
        `SELECT d.*, s.title AS section_title,
                COALESCE(json_agg(
                  json_build_object(
                    'id', da.id, 'name', da.name, 'description', da.description,
                    'activity_type', da.activity_type, 'expense', da.expense
                  ) ORDER BY da.sort_order
                ) FILTER (WHERE da.id IS NOT NULL), '[]') AS activities
         FROM itinerary_days d
         JOIN itinerary_sections s ON d.section_id = s.id
         LEFT JOIN day_activities da ON da.day_id = d.id
         WHERE s.trip_id = $1
         GROUP BY d.id, s.title
         ORDER BY d.day_number ASC`,
        [req.params.tripId]
      ),
    ]);

    if (tripRes.rows.length === 0) throw AppError.notFound('Trip not found');

    res.json({
      trip: tripRes.rows[0],
      sections: sectionsRes.rows,
      days: daysRes.rows,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

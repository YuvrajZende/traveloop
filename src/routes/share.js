const router = require('express').Router();
const crypto = require('crypto');
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');
const AppError = require('../utils/AppError');
const { validateUUID } = require('../utils/helpers');

// =============================================
// PUBLIC / SHARED ITINERARY (Screen 11)
// =============================================

/**
 * Generate a short, URL-safe slug (8 chars).
 */
const generateSlug = () => crypto.randomBytes(4).toString('hex');

// ── POST /api/share/:tripId  (Generate share link) ───
router.post('/:tripId',
  authenticateToken,
  validateUUID('tripId'),
  async (req, res, next) => {
    try {
      // Verify ownership
      const trip = await db.query(
        'SELECT id, share_slug FROM trips WHERE id = $1 AND user_id = $2',
        [req.params.tripId, req.user.id]
      );
      if (trip.rows.length === 0) throw AppError.notFound('Trip not found');

      // If a slug already exists, return it
      if (trip.rows[0].share_slug) {
        return res.json({
          share_slug: trip.rows[0].share_slug,
          share_url: `/shared/${trip.rows[0].share_slug}`,
          message: 'Share link already exists',
        });
      }

      // Generate new slug
      const slug = generateSlug();
      await db.query(
        `UPDATE trips SET share_slug = $1, is_public = true, updated_at = NOW()
         WHERE id = $2`,
        [slug, req.params.tripId]
      );

      res.status(201).json({
        share_slug: slug,
        share_url: `/shared/${slug}`,
        message: 'Share link created',
      });
    } catch (err) {
      next(err);
    }
  }
);

// ── DELETE /api/share/:tripId  (Revoke share link) ────
router.delete('/:tripId',
  authenticateToken,
  validateUUID('tripId'),
  async (req, res, next) => {
    try {
      const { rows } = await db.query(
        `UPDATE trips SET share_slug = NULL, is_public = false, updated_at = NOW()
         WHERE id = $1 AND user_id = $2
         RETURNING id`,
        [req.params.tripId, req.user.id]
      );

      if (rows.length === 0) throw AppError.notFound('Trip not found');
      res.json({ message: 'Share link revoked' });
    } catch (err) {
      next(err);
    }
  }
);

// ── GET /api/share/view/:slug  (Public view — no auth) ──
router.get('/view/:slug', async (req, res, next) => {
  try {
    // Fetch the trip
    const tripRes = await db.query(
      `SELECT t.id, t.title, t.description, t.place, t.start_date, t.end_date,
              t.cover_image_url, t.total_budget, t.status,
              u.first_name, u.last_name, u.photo_url AS author_photo
       FROM trips t
       JOIN users u ON t.user_id = u.id
       WHERE t.share_slug = $1 AND t.is_public = true`,
      [req.params.slug]
    );

    if (tripRes.rows.length === 0) throw AppError.notFound('Shared trip not found or link expired');

    const trip = tripRes.rows[0];

    // Fetch itinerary sections + activities in parallel
    const [sectionsRes, travelersRes] = await Promise.all([
      db.query(
        `SELECT s.id, s.section_number, s.title, s.description, s.start_date, s.end_date, s.budget,
                COALESCE(json_agg(
                  json_build_object(
                    'name', a.name, 'description', a.description,
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
        [trip.id]
      ),
      db.query(
        'SELECT name, role FROM trip_travelers WHERE trip_id = $1',
        [trip.id]
      ),
    ]);

    res.json({
      trip,
      sections: sectionsRes.rows,
      travelers: travelersRes.rows,
    });
  } catch (err) {
    next(err);
  }
});

// ── POST /api/share/copy/:slug  (Copy trip to own account) ──
router.post('/copy/:slug', authenticateToken, async (req, res, next) => {
  try {
    // Find the shared trip
    const srcRes = await db.query(
      `SELECT * FROM trips WHERE share_slug = $1 AND is_public = true`,
      [req.params.slug]
    );

    if (srcRes.rows.length === 0) throw AppError.notFound('Shared trip not found');

    const src = srcRes.rows[0];

    // Copy trip + itinerary inside a transaction
    const newTrip = await db.transaction(async (client) => {
      // Copy trip
      const tripRes = await client.query(
        `INSERT INTO trips
          (user_id, title, description, place, start_date, end_date, total_budget, cover_image_url, is_preplanned)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true)
         RETURNING *`,
        [req.user.id, `${src.title} (copy)`, src.description, src.place,
         src.start_date, src.end_date, src.total_budget, src.cover_image_url]
      );

      const newTripId = tripRes.rows[0].id;

      // Copy itinerary sections
      const sections = await client.query(
        'SELECT * FROM itinerary_sections WHERE trip_id = $1 ORDER BY section_number',
        [src.id]
      );

      for (const section of sections.rows) {
        const newSection = await client.query(
          `INSERT INTO itinerary_sections
            (trip_id, section_number, title, description, start_date, end_date, budget)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           RETURNING id`,
          [newTripId, section.section_number, section.title, section.description,
           section.start_date, section.end_date, section.budget]
        );

        // Copy activities for this section
        await client.query(
          `INSERT INTO activities
            (section_id, name, description, location, activity_type, estimated_cost, start_time, end_time)
           SELECT $1, name, description, location, activity_type, estimated_cost, start_time, end_time
           FROM activities WHERE section_id = $2`,
          [newSection.rows[0].id, section.id]
        );
      }

      return tripRes.rows[0];
    });

    res.status(201).json({
      message: 'Trip copied successfully',
      trip: newTrip,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

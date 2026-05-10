const router = require('express').Router();
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

// =============================================
// DASHBOARD AGGREGATE (Screen 2 — Home)
// Returns everything the dashboard needs in one response.
// =============================================

router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.id;

    const [
      recentTrips,
      tripStats,
      upcomingTrip,
      budgetHighlights,
      popularRegions,
      checklistProgress,
    ] = await Promise.all([
      // 5 most recent trips
      db.query(
        `SELECT id, title, place, start_date, end_date, status, cover_image_url
         FROM trips WHERE user_id = $1
         ORDER BY created_at DESC LIMIT 5`,
        [userId]
      ),

      // Trip counts by status
      db.query(
        `SELECT
           COUNT(*)::int AS total,
           COUNT(*) FILTER (WHERE status = 'ongoing')::int   AS ongoing,
           COUNT(*) FILTER (WHERE status = 'upcoming')::int  AS upcoming,
           COUNT(*) FILTER (WHERE status = 'completed')::int AS completed
         FROM trips WHERE user_id = $1`,
        [userId]
      ),

      // Next upcoming trip (closest start_date in the future)
      db.query(
        `SELECT id, title, place, start_date, end_date, total_budget, cover_image_url
         FROM trips
         WHERE user_id = $1 AND status = 'upcoming' AND start_date >= CURRENT_DATE
         ORDER BY start_date ASC LIMIT 1`,
        [userId]
      ),

      // Budget highlights across all trips
      db.query(
        `SELECT
           COALESCE(SUM(total_budget), 0)::numeric AS total_budget,
           COALESCE(SUM(inv.grand_total), 0)::numeric AS total_spent
         FROM trips t
         LEFT JOIN invoices inv ON inv.trip_id = t.id AND inv.user_id = $1
         WHERE t.user_id = $1`,
        [userId]
      ),

      // Top 5 popular regions for recommendations
      db.query(
        `SELECT id, name, country, image_url, popularity_score
         FROM regions ORDER BY popularity_score DESC LIMIT 5`
      ),

      // Packing checklist progress across active trips
      db.query(
        `SELECT
           COUNT(ci.id)::int AS total_items,
           COUNT(ci.id) FILTER (WHERE ci.is_packed = true)::int AS packed_items
         FROM checklist_items ci
         JOIN checklist_categories cc ON ci.category_id = cc.id
         JOIN trips t ON cc.trip_id = t.id
         WHERE t.user_id = $1 AND t.status IN ('ongoing', 'upcoming')`,
        [userId]
      ),
    ]);

    const budget = budgetHighlights.rows[0];

    res.json({
      recent_trips: recentTrips.rows,
      trip_stats: tripStats.rows[0],
      upcoming_trip: upcomingTrip.rows[0] || null,
      budget_highlights: {
        total_budget: parseFloat(budget.total_budget),
        total_spent: parseFloat(budget.total_spent),
        remaining: parseFloat(budget.total_budget) - parseFloat(budget.total_spent),
      },
      recommended_regions: popularRegions.rows,
      checklist_progress: checklistProgress.rows[0],
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

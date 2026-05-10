const router = require('express').Router();
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');
const AppError = require('../utils/AppError');
const { requireFields, validateUUID } = require('../utils/helpers');

// =============================================
// BUDGET & COST BREAKDOWN (Screen 9)
// =============================================

// ── GET /api/budget/:tripId  (Full breakdown — chart-ready) ──
router.get('/:tripId', authenticateToken, validateUUID('tripId'), async (req, res, next) => {
  try {
    const tripId = req.params.tripId;

    const [tripRes, byCategory, byDay, dayActivities] = await Promise.all([
      // Trip with total budget
      db.query(
        `SELECT id, title, place, total_budget, start_date, end_date
         FROM trips WHERE id = $1 AND user_id = $2`,
        [tripId, req.user.id]
      ),

      // Expenses grouped by category (pie chart data)
      db.query(
        `SELECT category,
                COUNT(*)::int AS item_count,
                SUM(amount)::numeric AS total
         FROM budget_items
         WHERE trip_id = $1
         GROUP BY category
         ORDER BY total DESC`,
        [tripId]
      ),

      // Expenses grouped by date (bar chart data)
      db.query(
        `SELECT spent_date,
                SUM(amount)::numeric AS daily_total,
                COUNT(*)::int AS item_count
         FROM budget_items
         WHERE trip_id = $1 AND spent_date IS NOT NULL
         GROUP BY spent_date
         ORDER BY spent_date ASC`,
        [tripId]
      ),

      // Day-level expenses from itinerary
      db.query(
        `SELECT d.day_number, d.day_date,
                COALESCE(SUM(da.expense), 0)::numeric AS total_expense
         FROM itinerary_days d
         JOIN itinerary_sections s ON d.section_id = s.id
         LEFT JOIN day_activities da ON da.day_id = d.id
         WHERE s.trip_id = $1
         GROUP BY d.id, d.day_number, d.day_date
         ORDER BY d.day_number ASC`,
        [tripId]
      ),
    ]);

    if (tripRes.rows.length === 0) throw AppError.notFound('Trip not found');

    const trip = tripRes.rows[0];
    const totalBudget = parseFloat(trip.total_budget) || 0;
    const totalSpent = byCategory.rows.reduce((sum, c) => sum + parseFloat(c.total), 0);
    const remaining = totalBudget - totalSpent;

    // Over-budget alerts — days where spending > daily avg budget
    const tripDays = byDay.rows.length || 1;
    const dailyAvgBudget = totalBudget / tripDays;
    const overBudgetDays = byDay.rows
      .filter((d) => parseFloat(d.daily_total) > dailyAvgBudget)
      .map((d) => ({
        date: d.spent_date,
        spent: parseFloat(d.daily_total),
        over_by: +(parseFloat(d.daily_total) - dailyAvgBudget).toFixed(2),
      }));

    res.json({
      trip: { id: trip.id, title: trip.title, place: trip.place },
      summary: {
        total_budget: totalBudget,
        total_spent: +totalSpent.toFixed(2),
        remaining: +remaining.toFixed(2),
        utilization_pct: totalBudget > 0 ? +((totalSpent / totalBudget) * 100).toFixed(1) : 0,
        is_over_budget: remaining < 0,
      },
      by_category: byCategory.rows,
      by_day: byDay.rows,
      itinerary_expenses: dayActivities.rows,
      alerts: {
        over_budget_days: overBudgetDays,
        daily_avg_budget: +dailyAvgBudget.toFixed(2),
      },
    });
  } catch (err) {
    next(err);
  }
});

// ── POST /api/budget/items  (Add expense item) ────────
router.post('/items',
  authenticateToken,
  requireFields('trip_id', 'category', 'amount'),
  async (req, res, next) => {
    try {
      const { trip_id, category, description, amount, spent_date } = req.body;

      // Verify trip ownership
      const trip = await db.query(
        'SELECT id FROM trips WHERE id = $1 AND user_id = $2',
        [trip_id, req.user.id]
      );
      if (trip.rows.length === 0) throw AppError.notFound('Trip not found');

      const { rows } = await db.query(
        `INSERT INTO budget_items (trip_id, category, description, amount, spent_date)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [trip_id, category, description, amount, spent_date]
      );

      res.status(201).json(rows[0]);
    } catch (err) {
      next(err);
    }
  }
);

// ── DELETE /api/budget/items/:id ──────────────────────
router.delete('/items/:id', authenticateToken, validateUUID('id'), async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `DELETE FROM budget_items bi
       USING trips t
       WHERE bi.id = $1 AND bi.trip_id = t.id AND t.user_id = $2
       RETURNING bi.id`,
      [req.params.id, req.user.id]
    );

    if (rows.length === 0) throw AppError.notFound('Budget item not found');
    res.json({ message: 'Budget item deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

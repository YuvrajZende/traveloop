const router = require('express').Router();
const db = require('../db');
const { buildQuery } = require('../utils/helpers');

// =============================================
// ACTIVITY / CITY SEARCH (Screen 8)
// Public — no auth required for browsing
// =============================================

// ── GET /api/search/activities ────────────────────────
// Params: q, type, group_by, sort_by, order, min_cost, max_cost, duration, place
router.get('/activities', async (req, res, next) => {
  try {
    const { q, type, group_by, sort_by, order, min_cost, max_cost, duration, place } = req.query;

    const filters = [
      { field: ['a.name', 'a.description', 'a.location'], value: q, op: 'ILIKE' },
      { field: 'a.activity_type', value: type },
      { field: 't.place', value: place, op: 'ILIKE' },
    ];

    // Cost range filters
    if (min_cost) filters.push({ field: 'a.estimated_cost', value: parseFloat(min_cost), op: '>=' });
    if (max_cost) filters.push({ field: 'a.estimated_cost', value: parseFloat(max_cost), op: '<=' });

    // Duration filter — short (<2h), medium (2-5h), long (>5h)
    // Computed from start_time/end_time difference
    let durationClause = '';
    if (duration === 'short') {
      durationClause = ` AND EXTRACT(EPOCH FROM (a.end_time - a.start_time)) / 3600 < 2`;
    } else if (duration === 'medium') {
      durationClause = ` AND EXTRACT(EPOCH FROM (a.end_time - a.start_time)) / 3600 BETWEEN 2 AND 5`;
    } else if (duration === 'long') {
      durationClause = ` AND EXTRACT(EPOCH FROM (a.end_time - a.start_time)) / 3600 > 5`;
    }

    const { query, params } = buildQuery({
      baseQuery: `SELECT a.*, s.title AS section_title, t.title AS trip_title, t.place
                  FROM activities a
                  JOIN itinerary_sections s ON a.section_id = s.id
                  JOIN trips t ON s.trip_id = t.id
                  WHERE 1=1${durationClause}`,
      filters,
      sort: {
        allowedFields: ['name', 'estimated_cost', 'created_at'],
        field: sort_by,
        order,
        prefix: 'a',
      },
      pagination: { limit: 50 },
    });

    const { rows } = await db.query(query, params);

    // Group-by support
    if (group_by === 'type' || group_by === 'place') {
      const key = group_by === 'type' ? 'activity_type' : 'place';
      const grouped = {};
      for (const row of rows) {
        const group = row[key] || 'other';
        (grouped[group] ||= []).push(row);
      }
      return res.json({ grouped: true, data: grouped });
    }

    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// ── GET /api/search/cities ────────────────────────────
// Params: q, country, region, min_score, sort_by, order
router.get('/cities', async (req, res, next) => {
  try {
    const { q, country, region, min_score, sort_by, order } = req.query;

    const filters = [
      { field: ['r.name', 'r.country'], value: q, op: 'ILIKE' },
      { field: 'r.country', value: country },
      { field: 'r.name', value: region, op: 'ILIKE' },
    ];

    // Popularity score threshold
    if (min_score) filters.push({ field: 'r.popularity_score', value: parseFloat(min_score), op: '>=' });

    const { query, params } = buildQuery({
      baseQuery: `SELECT r.*, COUNT(ps.id)::int AS suggestion_count
                  FROM regions r
                  LEFT JOIN place_suggestions ps ON ps.region_id = r.id
                  WHERE 1=1`,
      filters,
      sort: {
        allowedFields: ['name', 'popularity_score', 'country'],
        field: sort_by,
        order,
        prefix: 'r',
      },
      pagination: { limit: 30 },
    });

    // Add GROUP BY before ORDER BY
    const finalQuery = query.replace(' ORDER BY', ' GROUP BY r.id ORDER BY');

    const { rows } = await db.query(finalQuery, params);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

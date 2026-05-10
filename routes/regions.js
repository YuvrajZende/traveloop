const router = require('express').Router();
const db = require('../db');
const { buildQuery } = require('../utils/helpers');

// ── GET /api/regions  (Screen 3 — Top Regional Selections) ──
router.get('/', async (req, res, next) => {
  try {
    const { rows } = await db.query(
      'SELECT * FROM regions ORDER BY popularity_score DESC LIMIT 20'
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// ── GET /api/regions/search?q=  (Search bar — Screen 3) ──
// NOTE: This route must be defined BEFORE /:id to avoid conflicts
router.get('/search', async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);

    const { query, params } = buildQuery({
      baseQuery: 'SELECT * FROM regions WHERE 1=1',
      filters: [
        { field: ['name', 'country'], value: q, op: 'ILIKE' },
      ],
      sort: { allowedFields: ['popularity_score'], field: 'popularity_score', order: 'desc' },
      pagination: { limit: 10 },
    });

    const { rows } = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// ── GET /api/regions/:id/suggestions  (Screen 4) ──────
router.get('/:id/suggestions', async (req, res, next) => {
  try {
    const { category } = req.query;

    const { query, params } = buildQuery({
      baseQuery: 'SELECT * FROM place_suggestions WHERE region_id = $1',
      baseParams: [req.params.id],
      filters: [
        { field: 'category', value: category },
      ],
      sort: { allowedFields: ['rating', 'name'], field: 'rating', order: 'desc' },
    });

    const { rows } = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

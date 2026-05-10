const express = require('express');
const { query } = require('../config/db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// ── GET /api/places  ──────────────────────────────────────
// Search / list all places (Screen 3 & 4 - search bar, select a place)
router.get('/', authenticate, async (req, res, next) => {
  try {
    const { search, country, category, limit = 20, offset = 0 } = req.query;

    let sql = `SELECT id, name, city, country, description, image_url,
                      latitude, longitude, is_featured, category
               FROM places WHERE 1=1`;
    const params = [];

    if (search) {
      params.push(`%${search}%`);
      sql += ` AND (name ILIKE $${params.length} OR city ILIKE $${params.length} OR country ILIKE $${params.length})`;
    }
    if (country) {
      params.push(country);
      sql += ` AND country = $${params.length}`;
    }
    if (category) {
      params.push(category);
      sql += ` AND category = $${params.length}`;
    }

    params.push(parseInt(limit), parseInt(offset));
    sql += ` ORDER BY is_featured DESC, name ASC LIMIT $${params.length - 1} OFFSET $${params.length}`;

    const result = await query(sql, params);
    res.json({ success: true, data: { places: result.rows, count: result.rows.length } });
  } catch (err) {
    next(err);
  }
});

// ── GET /api/places/featured ──────────────────────────────
// Top regional selections (Screen 3 - "Top Regional Selections" section)
router.get('/featured', authenticate, async (req, res, next) => {
  try {
    const result = await query(
      `SELECT id, name, city, country, description, image_url, category
       FROM places WHERE is_featured = TRUE
       ORDER BY name ASC LIMIT 8`
    );
    res.json({ success: true, data: { places: result.rows } });
  } catch (err) {
    next(err);
  }
});

// ── GET /api/places/:id ───────────────────────────────────
// Get place details + its suggestions (Screen 4 - activity suggestions)
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;

    const placeResult = await query(
      `SELECT id, name, city, country, description, image_url, latitude, longitude, category
       FROM places WHERE id = $1`,
      [id]
    );

    if (placeResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Place not found' });
    }

    const suggestionsResult = await query(
      `SELECT id, name, category, description, image_url, rating
       FROM place_suggestions WHERE place_id = $1
       ORDER BY rating DESC NULLS LAST`,
      [id]
    );

    res.json({
      success: true,
      data: {
        place: placeResult.rows[0],
        suggestions: suggestionsResult.rows,
      },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

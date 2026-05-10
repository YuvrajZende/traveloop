const router = require('express').Router();
const bcrypt = require('bcryptjs');
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');
const AppError = require('../utils/AppError');
const { requireFields, validateUUID } = require('../utils/helpers');

// ── GET /api/users/me  (Screen 7 — profile) ───────────
router.get('/me', authenticateToken, async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `SELECT id, username, email, first_name, last_name,
              phone_number, city, country, photo_url,
              additional_info, role, created_at
       FROM users WHERE id = $1`,
      [req.user.id]
    );

    if (rows.length === 0) throw AppError.notFound('User not found');
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// ── PUT /api/users/me  (Screen 7 — edit profile) ──────
router.put('/me', authenticateToken, async (req, res, next) => {
  try {
    const {
      first_name, last_name, phone_number,
      city, country, photo_url, additional_info,
    } = req.body;

    const { rows } = await db.query(
      `UPDATE users SET
         first_name      = COALESCE($1, first_name),
         last_name       = COALESCE($2, last_name),
         phone_number    = COALESCE($3, phone_number),
         city            = COALESCE($4, city),
         country         = COALESCE($5, country),
         photo_url       = COALESCE($6, photo_url),
         additional_info = COALESCE($7, additional_info),
         updated_at      = NOW()
       WHERE id = $8
       RETURNING id, username, email, first_name, last_name,
                 phone_number, city, country, photo_url,
                 additional_info, role`,
      [first_name, last_name, phone_number, city, country,
       photo_url, additional_info, req.user.id]
    );

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// ── DELETE /api/users/me  (Delete account) ────────────
// Requires password confirmation for safety.
router.delete('/me',
  authenticateToken,
  requireFields('password'),
  async (req, res, next) => {
    try {
      const { password } = req.body;

      // Verify password before deletion
      const userRes = await db.query(
        'SELECT password_hash FROM users WHERE id = $1',
        [req.user.id]
      );
      if (userRes.rows.length === 0) throw AppError.notFound('User not found');

      const valid = await bcrypt.compare(password, userRes.rows[0].password_hash);
      if (!valid) throw AppError.unauthorized('Password is incorrect');

      // Cascade deletes everything (trips, notes, etc.)
      await db.query('DELETE FROM users WHERE id = $1', [req.user.id]);

      res.json({ message: 'Account deleted successfully' });
    } catch (err) {
      next(err);
    }
  }
);

// =============================================
// USER PREFERENCES (language, currency, theme)
// =============================================

// ── GET /api/users/preferences ────────────────────────
router.get('/preferences', authenticateToken, async (req, res, next) => {
  try {
    let { rows } = await db.query(
      'SELECT * FROM user_preferences WHERE user_id = $1',
      [req.user.id]
    );

    // Auto-create defaults if none exist
    if (rows.length === 0) {
      const result = await db.query(
        `INSERT INTO user_preferences (user_id)
         VALUES ($1) RETURNING *`,
        [req.user.id]
      );
      rows = result.rows;
    }

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// ── PUT /api/users/preferences ────────────────────────
router.put('/preferences', authenticateToken, async (req, res, next) => {
  try {
    const { language, currency, theme, notifications_enabled } = req.body;

    // Upsert — create if not exists, update otherwise
    const { rows } = await db.query(
      `INSERT INTO user_preferences (user_id, language, currency, theme, notifications_enabled)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_id) DO UPDATE SET
         language              = COALESCE($2, user_preferences.language),
         currency              = COALESCE($3, user_preferences.currency),
         theme                 = COALESCE($4, user_preferences.theme),
         notifications_enabled = COALESCE($5, user_preferences.notifications_enabled),
         updated_at            = NOW()
       RETURNING *`,
      [req.user.id, language, currency, theme, notifications_enabled]
    );

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// =============================================
// SAVED DESTINATIONS (bookmarked places)
// =============================================

// ── GET /api/users/destinations ───────────────────────
router.get('/destinations', authenticateToken, async (req, res, next) => {
  try {
    const { rows } = await db.query(
      'SELECT * FROM saved_destinations WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// ── POST /api/users/destinations ──────────────────────
router.post('/destinations',
  authenticateToken,
  requireFields('place_name'),
  async (req, res, next) => {
    try {
      const { place_name, country, notes } = req.body;

      const { rows } = await db.query(
        `INSERT INTO saved_destinations (user_id, place_name, country, notes)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [req.user.id, place_name, country, notes]
      );

      res.status(201).json(rows[0]);
    } catch (err) {
      next(err);
    }
  }
);

// ── DELETE /api/users/destinations/:id ────────────────
router.delete('/destinations/:id',
  authenticateToken,
  validateUUID('id'),
  async (req, res, next) => {
    try {
      const { rows } = await db.query(
        'DELETE FROM saved_destinations WHERE id = $1 AND user_id = $2 RETURNING id',
        [req.params.id, req.user.id]
      );

      if (rows.length === 0) throw AppError.notFound('Destination not found');
      res.json({ message: 'Destination removed' });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;

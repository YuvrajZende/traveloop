const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body } = require('express-validator');
const { query } = require('../config/db');
const { validate } = require('../middleware/errorHandler');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// ── Helpers ────────────────────────────────────────────────
const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
  const refreshToken = jwt.sign(
    { userId, type: 'refresh' },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
  return { accessToken, refreshToken };
};

const saveRefreshToken = async (userId, token) => {
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  await query(
    'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
    [userId, token, expiresAt]
  );
};

// ── POST /api/auth/register  (Screen 2) ───────────────────
router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('first_name').trim().notEmpty().withMessage('First name is required'),
    body('last_name').trim().notEmpty().withMessage('Last name is required'),
    body('phone').optional().isMobilePhone().withMessage('Invalid phone number'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { email, password, first_name, last_name, phone, city, country, bio } = req.body;

      // Check if email already exists
      const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
      if (existing.rows.length > 0) {
        return res.status(409).json({ success: false, message: 'Email already registered' });
      }

      const password_hash = await bcrypt.hash(password, 12);

      const result = await query(
        `INSERT INTO users (email, password_hash, first_name, last_name, phone, city, country, bio)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING id, email, first_name, last_name, phone, city, country, photo_url, created_at`,
        [email, password_hash, first_name, last_name, phone || null, city || null, country || null, bio || null]
      );

      const user = result.rows[0];
      const { accessToken, refreshToken } = generateTokens(user.id);
      await saveRefreshToken(user.id, refreshToken);

      res.status(201).json({
        success: true,
        message: 'Registration successful',
        data: { user, accessToken, refreshToken },
      });
    } catch (err) {
      next(err);
    }
  }
);

// ── POST /api/auth/login  (Screen 1) ─────────────────────
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const result = await query(
        `SELECT id, email, password_hash, first_name, last_name, photo_url, is_active
         FROM users WHERE email = $1`,
        [email]
      );

      if (result.rows.length === 0) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      const user = result.rows[0];

      if (!user.is_active) {
        return res.status(403).json({ success: false, message: 'Account deactivated' });
      }

      const passwordMatch = await bcrypt.compare(password, user.password_hash);
      if (!passwordMatch) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      const { accessToken, refreshToken } = generateTokens(user.id);
      await saveRefreshToken(user.id, refreshToken);

      const { password_hash, ...safeUser } = user;

      res.json({
        success: true,
        message: 'Login successful',
        data: { user: safeUser, accessToken, refreshToken },
      });
    } catch (err) {
      next(err);
    }
  }
);

// ── POST /api/auth/refresh-token ──────────────────────────
router.post('/refresh-token', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ success: false, message: 'Refresh token required' });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    if (decoded.type !== 'refresh') {
      return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }

    const stored = await query(
      'SELECT * FROM refresh_tokens WHERE token = $1 AND expires_at > NOW()',
      [refreshToken]
    );
    if (stored.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Refresh token expired or invalid' });
    }

    // Rotate token
    await query('DELETE FROM refresh_tokens WHERE token = $1', [refreshToken]);
    const { accessToken, refreshToken: newRefresh } = generateTokens(decoded.userId);
    await saveRefreshToken(decoded.userId, newRefresh);

    res.json({ success: true, data: { accessToken, refreshToken: newRefresh } });
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
    }
    next(err);
  }
});

// ── POST /api/auth/logout ─────────────────────────────────
router.post('/logout', authenticate, async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      await query('DELETE FROM refresh_tokens WHERE token = $1', [refreshToken]);
    }
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
});

// ── GET /api/auth/me ──────────────────────────────────────
router.get('/me', authenticate, async (req, res) => {
  res.json({ success: true, data: { user: req.user } });
});

module.exports = router;

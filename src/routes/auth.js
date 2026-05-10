const router = require('express').Router();
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const db = require('../db');
const { generateToken, authenticateToken } = require('../jwt');
const AppError = require('../utils/AppError');
const { requireFields } = require('../utils/helpers');

// ── POST /api/auth/register  (Screen 2) ───────────────
router.post('/register',
  requireFields('username', 'email', 'password', 'first_name', 'last_name'),
  async (req, res, next) => {
    try {
      const {
        username, email, password,
        first_name, last_name,
        phone_number, city, country,
        additional_info,
      } = req.body;

      // Password strength check
      if (password.length < 8) {
        throw AppError.badRequest('Password must be at least 8 characters');
      }

      // Check uniqueness
      const existing = await db.query(
        'SELECT id FROM users WHERE email = $1 OR username = $2',
        [email, username]
      );
      if (existing.rows.length > 0) {
        throw AppError.conflict('Username or email already taken');
      }

      const password_hash = await bcrypt.hash(password, 12);

      const { rows } = await db.query(
        `INSERT INTO users
          (username, email, password_hash, first_name, last_name,
           phone_number, city, country, additional_info)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
         RETURNING id, username, email, first_name, last_name, role`,
        [username, email, password_hash, first_name, last_name,
         phone_number, city, country, additional_info]
      );

      const user = rows[0];
      const token = generateToken({ id: user.id, username: user.username, role: user.role });

      res.status(201).json({ user, token });
    } catch (err) {
      next(err);
    }
  }
);

// ── POST /api/auth/login  (Screen 1) ──────────────────
router.post('/login',
  requireFields('username', 'password'),
  async (req, res, next) => {
    try {
      const { username, password } = req.body;

      const { rows } = await db.query(
        'SELECT * FROM users WHERE username = $1 OR email = $1',
        [username]
      );
      if (rows.length === 0) {
        throw AppError.unauthorized('Invalid credentials');
      }

      const user = rows[0];
      const valid = await bcrypt.compare(password, user.password_hash);
      if (!valid) {
        throw AppError.unauthorized('Invalid credentials');
      }

      // Block disabled accounts
      if (user.role === 'disabled') {
        throw AppError.forbidden('Account has been disabled. Contact support.');
      }

      const token = generateToken({ id: user.id, username: user.username, role: user.role });
      delete user.password_hash;

      res.json({ user, token });
    } catch (err) {
      next(err);
    }
  }
);

// ── POST /api/auth/forgot-password ────────────────────
// Generates a reset token (valid for 1 hour).
// In production, you would email this link — for the hackathon
// we return the token directly in the response.
router.post('/forgot-password',
  requireFields('email'),
  async (req, res, next) => {
    try {
      const { email } = req.body;

      const { rows } = await db.query(
        'SELECT id, email FROM users WHERE email = $1',
        [email]
      );

      // Always return 200 to prevent email enumeration
      if (rows.length === 0) {
        return res.json({
          message: 'If an account with that email exists, a reset link has been sent.',
        });
      }

      const user = rows[0];

      // Invalidate any existing unused tokens for this user
      await db.query(
        `UPDATE password_reset_tokens SET used = true
         WHERE user_id = $1 AND used = false`,
        [user.id]
      );

      // Generate a secure random token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await db.query(
        `INSERT INTO password_reset_tokens (user_id, token, expires_at)
         VALUES ($1, $2, $3)`,
        [user.id, resetToken, expiresAt]
      );

      // In production: send email with link containing resetToken
      // For hackathon, return the token directly
      res.json({
        message: 'If an account with that email exists, a reset link has been sent.',
        // Remove this in production — only here for hackathon testing
        reset_token: resetToken,
        expires_at: expiresAt,
      });
    } catch (err) {
      next(err);
    }
  }
);

// ── POST /api/auth/reset-password ─────────────────────
// Validates the reset token and sets a new password.
router.post('/reset-password',
  requireFields('token', 'new_password'),
  async (req, res, next) => {
    try {
      const { token, new_password } = req.body;

      if (new_password.length < 8) {
        throw AppError.badRequest('Password must be at least 8 characters');
      }

      // Find valid, unexpired, unused token
      const { rows } = await db.query(
        `SELECT rt.id, rt.user_id
         FROM password_reset_tokens rt
         WHERE rt.token = $1
           AND rt.used = false
           AND rt.expires_at > NOW()`,
        [token]
      );

      if (rows.length === 0) {
        throw AppError.badRequest('Invalid or expired reset token');
      }

      const resetRecord = rows[0];

      // Hash new password and update user, mark token as used — in a transaction
      await db.transaction(async (client) => {
        const password_hash = await bcrypt.hash(new_password, 12);

        await client.query(
          `UPDATE users SET password_hash = $1, updated_at = NOW()
           WHERE id = $2`,
          [password_hash, resetRecord.user_id]
        );

        await client.query(
          `UPDATE password_reset_tokens SET used = true
           WHERE id = $1`,
          [resetRecord.id]
        );
      });

      res.json({ message: 'Password has been reset successfully. You can now log in.' });
    } catch (err) {
      next(err);
    }
  }
);

// ── POST /api/auth/change-password ────────────────────
// For logged-in users to change their password.
router.post('/change-password',
  authenticateToken,
  requireFields('current_password', 'new_password'),
  async (req, res, next) => {
    try {
      const { current_password, new_password } = req.body;

      if (new_password.length < 8) {
        throw AppError.badRequest('New password must be at least 8 characters');
      }

      // Fetch current hash
      const { rows } = await db.query(
        'SELECT password_hash FROM users WHERE id = $1',
        [req.user.id]
      );

      if (rows.length === 0) throw AppError.notFound('User not found');

      const valid = await bcrypt.compare(current_password, rows[0].password_hash);
      if (!valid) {
        throw AppError.unauthorized('Current password is incorrect');
      }

      const password_hash = await bcrypt.hash(new_password, 12);

      await db.query(
        `UPDATE users SET password_hash = $1, updated_at = NOW()
         WHERE id = $2`,
        [password_hash, req.user.id]
      );

      res.json({ message: 'Password changed successfully' });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;

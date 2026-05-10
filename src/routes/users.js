const express = require('express');
const multer = require('multer');
const path = require('path');
const { body } = require('express-validator');
const { query } = require('../config/db');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/errorHandler');

const router = express.Router();

// ── Multer: profile photo upload ──────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, process.env.UPLOAD_DIR || 'uploads'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `user_${req.user.id}_${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    cb(null, allowed.test(file.mimetype));
  },
});

// ── GET /api/users/profile ────────────────────────────────
router.get('/profile', authenticate, async (req, res, next) => {
  try {
    const result = await query(
      `SELECT id, email, first_name, last_name, phone, city, country, photo_url, bio, created_at
       FROM users WHERE id = $1`,
      [req.user.id]
    );
    res.json({ success: true, data: { user: result.rows[0] } });
  } catch (err) {
    next(err);
  }
});

// ── PUT /api/users/profile ────────────────────────────────
router.put(
  '/profile',
  authenticate,
  [
    body('first_name').optional().trim().notEmpty(),
    body('last_name').optional().trim().notEmpty(),
    body('phone').optional().isMobilePhone(),
    body('city').optional().trim(),
    body('country').optional().trim(),
    body('bio').optional().trim(),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { first_name, last_name, phone, city, country, bio } = req.body;

      const result = await query(
        `UPDATE users
         SET first_name = COALESCE($1, first_name),
             last_name  = COALESCE($2, last_name),
             phone      = COALESCE($3, phone),
             city       = COALESCE($4, city),
             country    = COALESCE($5, country),
             bio        = COALESCE($6, bio)
         WHERE id = $7
         RETURNING id, email, first_name, last_name, phone, city, country, photo_url, bio`,
        [first_name, last_name, phone, city, country, bio, req.user.id]
      );

      res.json({ success: true, data: { user: result.rows[0] } });
    } catch (err) {
      next(err);
    }
  }
);

// ── POST /api/users/photo ─────────────────────────────────
router.post('/photo', authenticate, upload.single('photo'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No photo uploaded' });
    }

    const photoUrl = `/uploads/${req.file.filename}`;
    await query('UPDATE users SET photo_url = $1 WHERE id = $2', [photoUrl, req.user.id]);

    res.json({ success: true, data: { photo_url: photoUrl } });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

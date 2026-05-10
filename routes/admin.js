const router = require('express').Router();
const db = require('../db');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { buildQuery } = require('../utils/helpers');

// All admin routes require authentication + admin role
router.use(authenticateToken);
router.use(requireAdmin);

// ── GET /api/admin/stats  (Screen 12 — dashboard) ────
router.get('/stats', async (req, res, next) => {
  try {
    const [userStats, totalTrips, tripsByStatus] = await Promise.all([
      db.query('SELECT * FROM user_stats'),
      db.query('SELECT COUNT(*)::int AS total FROM trips'),
      db.query('SELECT status, COUNT(*)::int AS count FROM trips GROUP BY status'),
    ]);

    res.json({
      users: userStats.rows[0],
      trips: {
        total: totalTrips.rows[0].total,
        by_status: tripsByStatus.rows,
      },
    });
  } catch (err) {
    next(err);
  }
});

// ── GET /api/admin/popular-cities ─────────────────────
router.get('/popular-cities', async (req, res, next) => {
  try {
    const { rows } = await db.query('SELECT * FROM popular_cities LIMIT 20');
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// ── GET /api/admin/popular-activities ─────────────────
router.get('/popular-activities', async (req, res, next) => {
  try {
    const { rows } = await db.query('SELECT * FROM popular_activities LIMIT 20');
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// ── GET /api/admin/users ──────────────────────────────
router.get('/users', async (req, res, next) => {
  try {
    const { search, page, limit } = req.query;

    const { query, params } = buildQuery({
      baseQuery: `SELECT id, username, email, first_name, last_name,
                         city, country, role, created_at
                  FROM users WHERE 1=1`,
      filters: [
        { field: ['username', 'email', 'first_name', 'last_name'], value: search, op: 'ILIKE' },
      ],
      sort: { allowedFields: ['created_at'], field: 'created_at', order: 'desc' },
      pagination: { page: page || 1, limit: limit || 20 },
    });

    const [result, countResult] = await Promise.all([
      db.query(query, params),
      db.query('SELECT COUNT(*)::int AS total FROM users'),
    ]);

    res.json({
      users: result.rows,
      total: countResult.rows[0].total,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
    });
  } catch (err) {
    next(err);
  }
});

// =============================================
// ADMIN USER MANAGEMENT
// =============================================

// ── GET /api/admin/users/:id  (View single user) ─────
router.get('/users/:id', async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `SELECT id, username, email, first_name, last_name,
              phone_number, city, country, photo_url,
              role, created_at, updated_at
       FROM users WHERE id = $1`,
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    // Also fetch their trip count and note count
    const [tripCount, noteCount] = await Promise.all([
      db.query('SELECT COUNT(*)::int AS count FROM trips WHERE user_id = $1', [req.params.id]),
      db.query('SELECT COUNT(*)::int AS count FROM trip_notes WHERE user_id = $1', [req.params.id]),
    ]);

    res.json({
      ...rows[0],
      trip_count: tripCount.rows[0].count,
      note_count: noteCount.rows[0].count,
    });
  } catch (err) {
    next(err);
  }
});

// ── PATCH /api/admin/users/:id/role  (Change role) ────
// Body: { role: 'admin' | 'user' }
router.patch('/users/:id/role', async (req, res, next) => {
  try {
    const { role } = req.body;

    if (!role || !['admin', 'user'].includes(role)) {
      return res.status(400).json({ status: 'error', message: 'Role must be "admin" or "user"' });
    }

    const { rows } = await db.query(
      `UPDATE users SET role = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING id, username, email, role`,
      [role, req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    res.json({ message: `User role updated to ${role}`, user: rows[0] });
  } catch (err) {
    next(err);
  }
});

// ── PATCH /api/admin/users/:id/disable  (Disable user) ──
// Sets role to 'disabled' — effectively locks the account.
// The authenticateToken middleware already blocks disabled users
// if you add a role check. For now, this prevents login via role check.
router.patch('/users/:id/disable', async (req, res, next) => {
  try {
    // Don't allow admin to disable themselves
    if (req.params.id === req.user.id) {
      return res.status(400).json({ status: 'error', message: 'Cannot disable your own account' });
    }

    const { rows } = await db.query(
      `UPDATE users SET role = 'disabled', updated_at = NOW()
       WHERE id = $1
       RETURNING id, username, email, role`,
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    res.json({ message: 'User account disabled', user: rows[0] });
  } catch (err) {
    next(err);
  }
});

// ── PATCH /api/admin/users/:id/enable  (Re-enable user) ──
router.patch('/users/:id/enable', async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `UPDATE users SET role = 'user', updated_at = NOW()
       WHERE id = $1
       RETURNING id, username, email, role`,
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    res.json({ message: 'User account re-enabled', user: rows[0] });
  } catch (err) {
    next(err);
  }
});

// ── DELETE /api/admin/users/:id  (Delete user) ────────
router.delete('/users/:id', async (req, res, next) => {
  try {
    // Don't allow admin to delete themselves
    if (req.params.id === req.user.id) {
      return res.status(400).json({ status: 'error', message: 'Cannot delete your own account' });
    }

    const { rows } = await db.query(
      'DELETE FROM users WHERE id = $1 RETURNING id, username',
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    res.json({ message: `User ${rows[0].username} deleted`, id: rows[0].id });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

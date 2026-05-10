const db = require('../db');

// =============================================
// ROLE-BASED ACCESS CONTROL (RBAC)
// =============================================
// Roles: admin, user
// Trip-level roles: creator, member

/**
 * Restrict access to specific user roles.
 * Usage: requireRole('admin')  or  requireRole('admin', 'user')
 */
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Access denied. Required role: ${allowedRoles.join(' or ')}`,
      });
    }
    next();
  };
};

/**
 * Verify the authenticated user owns the trip (or is admin).
 * Expects :tripId in route params, or trip_id in req.body.
 */
const requireTripOwner = async (req, res, next) => {
  try {
    const tripId = req.params.tripId || req.params.id || req.body.trip_id;
    if (!tripId) {
      return res.status(400).json({ error: 'Trip ID is required' });
    }

    // Admins can access any trip
    if (req.user.role === 'admin') {
      return next();
    }

    const result = await db.query(
      'SELECT id FROM trips WHERE id = $1 AND user_id = $2',
      [tripId, req.user.id]
    );

    if (result.rows.length === 0) {
      // Check if user is a member/collaborator on this trip
      const traveler = await db.query(
        'SELECT id FROM trip_travelers WHERE trip_id = $1 AND user_id = $2',
        [tripId, req.user.id]
      );

      if (traveler.rows.length === 0) {
        return res.status(403).json({ error: 'You do not have access to this trip' });
      }

      // Attach trip role to request for downstream use
      req.tripRole = 'member';
    } else {
      req.tripRole = 'creator';
    }

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  requireRole,
  requireTripOwner,
};

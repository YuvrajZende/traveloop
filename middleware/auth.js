const { authenticateToken } = require('../jwt');
const { requireRole, requireTripOwner } = require('./rbac');

/**
 * Middleware to check if the authenticated user has admin role.
 * Must be used AFTER authenticateToken.
 */
const requireAdmin = requireRole('admin');

module.exports = {
  authenticateToken,
  requireAdmin,
  requireRole,
  requireTripOwner,
};

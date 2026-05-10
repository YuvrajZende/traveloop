const AppError = require('./AppError');

/**
 * Builds a dynamic WHERE clause from filter definitions.
 * Eliminates the repeated query-building boilerplate across all routes.
 *
 * @param {Object} options
 * @param {String} options.baseQuery     - The base SQL query (up to WHERE/AND)
 * @param {Array}  options.baseParams    - Initial parameter values
 * @param {Array}  options.filters       - Array of filter definitions:
 *   { field: 'status', value: queryValue, op: '=' }
 *   { field: ['title', 'place'], value: queryValue, op: 'ILIKE' }  ← OR search
 * @param {Object} options.sort          - { allowedFields: [...], field, order, prefix }
 * @param {Object} options.pagination    - { page, limit }
 * @returns {{ query: String, params: Array }}
 */
const buildQuery = ({
  baseQuery,
  baseParams = [],
  filters = [],
  sort = {},
  pagination = {},
}) => {
  let query = baseQuery;
  const params = [...baseParams];
  let idx = params.length + 1;

  // ── Dynamic filters ──────────────────────────────────
  for (const f of filters) {
    if (f.value === undefined || f.value === null || f.value === '') continue;

    const op = f.op || '=';

    if (Array.isArray(f.field)) {
      // OR across multiple columns (search)
      const clauses = f.field.map((col) => `${col} ${op} $${idx}`);
      query += ` AND (${clauses.join(' OR ')})`;
      params.push(op === 'ILIKE' ? `%${f.value}%` : f.value);
      idx++;
    } else {
      query += ` AND ${f.field} ${op} $${idx}`;
      params.push(op === 'ILIKE' ? `%${f.value}%` : f.value);
      idx++;
    }
  }

  // ── Sorting (safe — only allows whitelisted fields) ──
  if (sort.allowedFields) {
    const prefix = sort.prefix ? `${sort.prefix}.` : '';
    const fallback = sort.allowedFields[0] || 'created_at';
    const sortField = sort.allowedFields.includes(sort.field)
      ? `${prefix}${sort.field}`
      : `${prefix}${fallback}`;
    const sortOrder = sort.order === 'asc' ? 'ASC' : 'DESC';
    query += ` ORDER BY ${sortField} ${sortOrder}`;
  }

  // ── Pagination ───────────────────────────────────────
  if (pagination.limit) {
    const limit = Math.min(parseInt(pagination.limit) || 20, 100);
    const page = Math.max(parseInt(pagination.page) || 1, 1);
    const offset = (page - 1) * limit;
    query += ` LIMIT $${idx} OFFSET $${idx + 1}`;
    params.push(limit, offset);
  }

  return { query, params };
};

/**
 * Validates that all required fields are present in the request body.
 * Returns middleware.
 *
 * @param {String[]} fields - Required field names
 */
const requireFields = (...fields) => {
  return (req, res, next) => {
    const missing = fields.filter((f) => {
      const val = req.body[f];
      return val === undefined || val === null || val === '';
    });

    if (missing.length > 0) {
      return next(AppError.badRequest(`Missing required fields: ${missing.join(', ')}`));
    }
    next();
  };
};

/**
 * Validates that a UUID parameter looks valid.
 * Prevents DB errors from malformed IDs.
 */
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const validateUUID = (...paramNames) => {
  return (req, res, next) => {
    for (const name of paramNames) {
      const value = req.params[name] || req.body[name];
      if (value && !UUID_REGEX.test(value)) {
        return next(AppError.badRequest(`Invalid UUID format for '${name}'`));
      }
    }
    next();
  };
};

module.exports = { buildQuery, requireFields, validateUUID };

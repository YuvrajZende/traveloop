const { validationResult } = require('express-validator');

// Validate express-validator results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(e => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

// Global error handler
const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err.message);

  if (err.code === '23505') {
    return res.status(409).json({ success: false, message: 'Record already exists' });
  }
  if (err.code === '23503') {
    return res.status(400).json({ success: false, message: 'Referenced record not found' });
  }

  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Internal server error',
  });
};

module.exports = { validate, errorHandler };

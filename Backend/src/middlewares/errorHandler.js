const logger = require('../config/logger');
const { AppError } = require('../utils/errors');
const { error } = require('../utils/response');

module.exports = (err, req, res, next) => {
  logger.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method
  });

  if (err instanceof AppError) {
    return error(res, err.message, err.statusCode, err.code, err.errors);
  }

  if (err.name === 'SequelizeValidationError') {
    const errors = err.errors.map(e => ({
      field: e.path,
      message: e.message
    }));
    return error(res, 'Validation error', 400, 'VALIDATION_ERROR', errors);
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    return error(res, 'Duplicate entry', 409, 'DUPLICATE_ENTRY');
  }

  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return error(res, 'Invalid reference', 400, 'FOREIGN_KEY_ERROR');
  }

  return error(res, 'Internal server error', 500, 'INTERNAL_ERROR');
};




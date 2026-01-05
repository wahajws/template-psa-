const { validationResult } = require('express-validator');
const { ValidationError } = require('../utils/errors');

function validate(req, res, next) {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(err => ({
      field: err.path || err.param,
      message: err.msg,
      value: err.value
    }));
    
    throw new ValidationError('Validation failed', formattedErrors);
  }
  
  next();
}

module.exports = validate;




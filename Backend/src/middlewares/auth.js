const jwt = require('jsonwebtoken');
const config = require('../config/env');
const { UnauthorizedError } = require('../utils/errors');
const { User } = require('../models');

async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided');
    }

    const token = authHeader.substring(7);
    
    try {
      const decoded = jwt.verify(token, config.JWT_SECRET);
      const user = await User.findByPk(decoded.userId);

      if (!user || user.status === 'deleted' || user.status === 'suspended') {
        throw new UnauthorizedError('Invalid or inactive user');
      }

      req.user = user;
      req.userId = user.id;
      next();
    } catch (tokenError) {
      throw new UnauthorizedError('Invalid token');
    }
  } catch (err) {
    next(err);
  }
}

async function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  return authenticate(req, res, next);
}

module.exports = {
  authenticate,
  optionalAuth
};


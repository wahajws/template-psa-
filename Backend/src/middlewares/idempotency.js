const { ConflictError } = require('../utils/errors');
const { Op } = require('sequelize');

const idempotencyStore = new Map();

function idempotency(ttl = 3600000) {
  return async (req, res, next) => {
    const idempotencyKey = req.headers['idempotency-key'];
    
    if (!idempotencyKey) {
      return next();
    }

    const key = `${req.method}:${req.path}:${idempotencyKey}`;
    const existing = idempotencyStore.get(key);

    if (existing) {
      if (Date.now() - existing.timestamp < ttl) {
        return res.status(existing.statusCode).json(existing.response);
      } else {
        idempotencyStore.delete(key);
      }
    }

    const originalJson = res.json.bind(res);
    res.json = function(data) {
      idempotencyStore.set(key, {
        timestamp: Date.now(),
        statusCode: res.statusCode,
        response: data
      });
      return originalJson(data);
    };

    next();
  };
}

module.exports = idempotency;




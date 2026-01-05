const express = require('express');
const router = express.Router();
const TelemetryController = require('../controllers/TelemetryController');
const { optionalAuth } = require('../middlewares/auth');
const rateLimit = require('express-rate-limit');
const { body } = require('express-validator');
const validate = require('../middlewares/validate');

// Rate limit for anonymous telemetry (stricter)
const anonymousLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many telemetry requests, please try again later',
  skip: (req) => req.userId !== undefined, // Skip if authenticated
});

// Rate limit for authenticated telemetry (more lenient)
const authenticatedLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000, // 1000 requests per window
  message: 'Too many telemetry requests, please try again later',
  skip: (req) => req.userId === undefined, // Skip if not authenticated
});

router.post('/', 
  optionalAuth,
  anonymousLimiter,
  authenticatedLimiter,
  [
    body('event_name').notEmpty().isString(),
    body('company_id').optional().isUUID(),
    body('branch_id').optional().isUUID(),
    body('entity_type').optional().isString(),
    body('entity_id').optional().isUUID(),
    body('properties').optional().isObject(),
    validate
  ],
  TelemetryController.track.bind(TelemetryController)
);

module.exports = router;



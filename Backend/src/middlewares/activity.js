/**
 * Activity Middleware
 * Enriches request context with activity tracking information
 */
const ActivityLogger = require('../utils/activityLogger');

/**
 * Middleware to extract activity context from request
 * Attaches to req.activityContext for use in controllers/services
 */
function activityContext(req, res, next) {
  // Extract IP address
  const ipAddress = req.ip || 
    req.headers['x-forwarded-for']?.split(',')[0] || 
    req.headers['x-real-ip'] || 
    req.connection?.remoteAddress || 
    'unknown';

  // Extract user agent
  const userAgent = req.headers['user-agent'] || 'unknown';

  // Extract actor from JWT (if authenticated)
  const actorUserId = req.userId || null;

  // Extract company/branch from params or body
  const companyId = req.companyId || req.params.companyId || req.body.company_id || null;
  const branchId = req.branchId || req.params.branchId || req.body.branch_id || null;

  // Attach context to request
  req.activityContext = {
    actor_user_id: actorUserId,
    company_id: companyId,
    branch_id: branchId,
    ip_address: ipAddress,
    user_agent: userAgent,
    path: req.path,
    method: req.method,
    request_id: req.id || null,
  };

  next();
}

/**
 * Helper to log activity from controller/service
 * Usage: await logActivity(req, { action: 'login', entity_type: 'auth', ... })
 */
async function logActivity(req, eventData) {
  if (!req.activityContext) {
    console.warn('Activity context not available - ensure activityContext middleware is applied');
    return;
  }

  const {
    actor_user_id,
    company_id,
    branch_id,
    ip_address,
    user_agent,
    path,
    method,
    request_id,
  } = req.activityContext;

  await ActivityLogger.logEvent({
    actor_user_id: eventData.actor_user_id || actor_user_id, // Allow override from eventData
    company_id,
    branch_id,
    action: eventData.action,
    entity_type: eventData.entity_type,
    entity_id: eventData.entity_id || null,
    metadata: {
      ip_address,
      user_agent,
      path,
      method,
      request_id,
      ...eventData.metadata,
    },
    before_snapshot: eventData.before_snapshot,
    after_snapshot: eventData.after_snapshot,
  });
}

module.exports = {
  activityContext,
  logActivity,
};



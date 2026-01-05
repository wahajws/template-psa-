const { AuditLog } = require('../models');
const { generateUUID } = require('./uuid');

/**
 * Activity Logger Utility
 * Logs user activity events to audit_logs table
 */
class ActivityLogger {
  /**
   * Log an activity event
   * @param {Object} params
   * @param {string|null} params.actor_user_id - User ID (nullable for anonymous)
   * @param {string|null} params.company_id - Company ID (nullable)
   * @param {string|null} params.branch_id - Branch ID (nullable)
   * @param {string} params.action - Action type (e.g., 'login', 'booking_created')
   * @param {string} params.entity_type - Entity type (e.g., 'booking', 'user', 'auth')
   * @param {string|null} params.entity_id - Entity ID (nullable)
   * @param {Object} params.metadata - Additional metadata (ip_address, user_agent, path, method, etc.)
   * @param {Object} params.before_snapshot - Before state (optional)
   * @param {Object} params.after_snapshot - After state (optional)
   * @param {Object} transaction - Sequelize transaction (optional)
   */
  static async logEvent({
    actor_user_id = null,
    company_id = null,
    branch_id = null,
    action,
    entity_type,
    entity_id = null,
    metadata = {},
    before_snapshot = null,
    after_snapshot = null,
  }, transaction = null) {
    try {
      // Sanitize metadata - remove sensitive data
      const safeMetadata = this.sanitizeMetadata(metadata);

      // Include company_id and branch_id in metadata if not in dedicated columns
      if (company_id) {
        safeMetadata.company_id = company_id;
      }
      if (branch_id) {
        safeMetadata.branch_id = branch_id;
      }

      // System user ID for anonymous actions (must exist in users table)
      const SYSTEM_USER_ID = '00000000-0000-0000-0000-000000000000';
      const PLACEHOLDER_ID = '00000000-0000-0000-0000-000000000001';

      const logData = {
        id: generateUUID(),
        actor_user_id: actor_user_id || SYSTEM_USER_ID, // Use system user ID for anonymous
        action: this.normalizeAction(action),
        entity_type,
        entity_id: entity_id || PLACEHOLDER_ID, // Use placeholder for null
        before_snapshot,
        after_snapshot,
        ip_address: metadata.ip_address || null,
        user_agent: metadata.user_agent || null,
        metadata: safeMetadata,
        created_at: new Date(),
      };

      const options = transaction ? { transaction } : {};
      await AuditLog.create(logData, options);
    } catch (error) {
      // Don't throw - logging should never break the main flow
      console.error('ActivityLogger error:', error);
    }
  }

  /**
   * Sanitize metadata to remove sensitive information
   */
  static sanitizeMetadata(metadata) {
    const sensitiveKeys = ['password', 'otp', 'token', 'secret', 'api_key', 'access_token', 'refresh_token'];
    const sanitized = { ...metadata };

    // Remove sensitive keys
    sensitiveKeys.forEach(key => {
      if (sanitized[key]) {
        sanitized[key] = '[REDACTED]';
      }
    });

    // Recursively sanitize nested objects
    Object.keys(sanitized).forEach(key => {
      if (typeof sanitized[key] === 'object' && sanitized[key] !== null && !Array.isArray(sanitized[key])) {
        sanitized[key] = this.sanitizeMetadata(sanitized[key]);
      }
    });

    return sanitized;
  }

  /**
   * Normalize action to match enum or use string
   * Since action is ENUM in DB, we'll use the enum values when possible
   * For new actions, we'll need to update the enum or use a string field
   */
  static normalizeAction(action) {
    const enumActions = ['create', 'update', 'delete', 'restore', 'login', 'logout', 'permission_grant', 'permission_revoke'];
    
    // Map common actions to enum values
    const actionMap = {
      'signup': 'create',
      'booking_created': 'create',
      'booking_rescheduled': 'update',
      'booking_cancelled': 'delete',
      'membership_purchased': 'create',
      'membership_cancelled': 'delete',
      'payment_intent_created': 'create',
      'payment_confirmed': 'update',
      'refund_created': 'create',
      'gift_card_purchased': 'create',
      'gift_card_redeemed': 'update',
      'media_uploaded': 'create',
      'media_deleted': 'delete',
      'company_created': 'create',
      'company_updated': 'update',
      'company_suspended': 'update',
      'otp_request': 'create',
      'otp_verify': 'update',
    };

    const mapped = actionMap[action] || action;
    
    // If mapped action is in enum, use it; otherwise use original (will need DB update)
    return enumActions.includes(mapped) ? mapped : action;
  }
}

module.exports = ActivityLogger;


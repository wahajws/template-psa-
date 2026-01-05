const { AuditLog } = require('../models');
const { generateUUID } = require('./uuid');

/**
 * Telemetry Logger
 * Logs user behavior events for product analytics
 * Uses audit_logs table as event store
 */
class Telemetry {
  /**
   * Track a behavior event
   * @param {Object} req - Express request object
   * @param {Object} eventData
   * @param {string} eventData.event_name - Event name (e.g., 'auth.login', 'booking.confirmed')
   * @param {string|null} eventData.company_id - Company ID (optional)
   * @param {string|null} eventData.branch_id - Branch ID (optional)
   * @param {string|null} eventData.entity_type - Entity type (optional)
   * @param {string|null} eventData.entity_id - Entity ID (optional)
   * @param {Object} eventData.properties - Event properties (optional)
   */
  static async track(req, {
    event_name,
    company_id = null,
    branch_id = null,
    entity_type = null,
    entity_id = null,
    properties = {},
  }) {
    try {
      // Extract context from request
      const actor_user_id = req.userId || null;
      const ip_address = req.ip || 
        req.headers['x-forwarded-for']?.split(',')[0] || 
        req.headers['x-real-ip'] || 
        req.connection?.remoteAddress || 
        null;
      const user_agent = req.headers['user-agent'] || null;
      const path = req.path || null;
      const method = req.method || null;
      const referrer = req.headers.referer || req.headers.referrer || null;
      const session_id = req.headers['x-session-id'] || req.sessionId || null;
      const request_id = req.id || null;

      // Derive device type from user agent
      const device_type = this.deriveDeviceType(user_agent);

      // Sanitize properties (mask sensitive data, round geo coordinates)
      const safeProperties = this.sanitizeProperties(properties);

      // Build metadata
      const metadata = {
        event_name,
        event_time: new Date().toISOString(),
        session_id,
        request_id,
        page_path: path,
        referrer,
        device_type,
        user_agent,
        ip_address,
        ...safeProperties,
      };

      // Use system user ID for anonymous events
      const SYSTEM_USER_ID = '00000000-0000-0000-0000-000000000000';
      const PLACEHOLDER_ID = '00000000-0000-0000-0000-000000000001';

      const logData = {
        id: generateUUID(),
        actor_user_id: actor_user_id || SYSTEM_USER_ID,
        action: event_name, // Store event_name as action
        entity_type: entity_type || 'telemetry',
        entity_id: entity_id || PLACEHOLDER_ID,
        before_snapshot: null,
        after_snapshot: null,
        ip_address,
        user_agent,
        metadata,
        created_at: new Date(),
      };

      // Include company_id and branch_id in metadata if provided
      if (company_id) {
        logData.metadata.company_id = company_id;
      }
      if (branch_id) {
        logData.metadata.branch_id = branch_id;
      }

      await AuditLog.create(logData);
    } catch (error) {
      // Don't throw - telemetry should never break the main flow
      console.error('Telemetry error:', error);
    }
  }

  /**
   * Derive device type from user agent
   */
  static deriveDeviceType(userAgent) {
    if (!userAgent) return 'unknown';
    const ua = userAgent.toLowerCase();
    if (ua.match(/mobile|android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i)) {
      return 'mobile';
    }
    if (ua.match(/tablet|ipad/i)) {
      return 'tablet';
    }
    return 'desktop';
  }

  /**
   * Sanitize properties to remove sensitive data and round geo coordinates
   */
  static sanitizeProperties(properties) {
    const sanitized = { ...properties };

    // Mask promo/gift codes
    if (sanitized.promo_code) {
      const code = String(sanitized.promo_code);
      if (code.length > 4) {
        sanitized.promo_code = `${code.substring(0, 3)}***${code.substring(code.length - 3)}`;
        sanitized.promo_code_length = code.length;
      } else {
        sanitized.promo_code = '***';
      }
    }

    if (sanitized.gift_card_code) {
      const code = String(sanitized.gift_card_code);
      if (code.length > 4) {
        sanitized.gift_card_code = `${code.substring(0, 3)}***${code.substring(code.length - 3)}`;
        sanitized.gift_card_code_length = code.length;
      } else {
        sanitized.gift_card_code = '***';
      }
    }

    // Round geo coordinates to 2 decimals
    if (typeof sanitized.latitude === 'number') {
      sanitized.latitude = Math.round(sanitized.latitude * 100) / 100;
    }
    if (typeof sanitized.longitude === 'number') {
      sanitized.longitude = Math.round(sanitized.longitude * 100) / 100;
    }

    // Remove sensitive fields
    const sensitiveKeys = ['password', 'token', 'secret', 'api_key', 'access_token', 'refresh_token', 'otp', 'card_number', 'cvv'];
    sensitiveKeys.forEach(key => {
      if (sanitized[key]) {
        delete sanitized[key];
      }
    });

    return sanitized;
  }

  /**
   * Validate event name against allow-list
   */
  static isValidEventName(eventName) {
    const allowedEvents = [
      // Auth & Onboarding
      'auth.signup',
      'auth.login',
      'auth.logout',
      'auth.otp_request',
      'auth.otp_verify',
      'profile.updated',
      // Discovery / Search
      'explore.search',
      'branch.view',
      'court.view',
      'gallery.view',
      // Booking Funnel
      'booking.start',
      'booking.slot_view',
      'booking.quote_view',
      'booking.promo_applied',
      'booking.giftcard_applied',
      'booking.confirmed',
      'booking.cancelled',
      'booking.rescheduled',
      'booking.failed',
      // Membership Funnel
      'membership.list_view',
      'membership.plan_view',
      'membership.purchase_started',
      'membership.purchase_completed',
      'membership.cancelled',
      // Payments
      'payment.intent_created',
      'payment.confirmed',
      'payment.failed',
      'refund.created',
      // Engagement
      'notification.opened',
      'support.ticket_created',
      // Media
      'media.uploaded',
      'media.deleted',
    ];

    return allowedEvents.includes(eventName);
  }
}

module.exports = Telemetry;



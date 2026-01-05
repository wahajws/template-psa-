const Telemetry = require('../utils/telemetry');
const { success } = require('../utils/response');
const { ValidationError } = require('../utils/errors');

class TelemetryController {
  /**
   * POST /telemetry
   * Submit a behavior event (anonymous allowed, rate-limited)
   */
  async track(req, res, next) {
    try {
      const { event_name, company_id, branch_id, entity_type, entity_id, properties } = req.body;

      if (!event_name) {
        throw new ValidationError('event_name is required');
      }

      // Validate event name against allow-list
      if (!Telemetry.isValidEventName(event_name)) {
        throw new ValidationError(`Invalid event_name: ${event_name}`);
      }

      // Track the event
      await Telemetry.track(req, {
        event_name,
        company_id,
        branch_id,
        entity_type,
        entity_id,
        properties: properties || {},
      });

      // Return 204 No Content
      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new TelemetryController();



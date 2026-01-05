const BehaviourService = require('../services/BehaviourService');
const { success } = require('../utils/response');

class BehaviourController {
  /**
   * GET /admin/behaviour
   * Get behavior events with filters
   */
  async getBehaviourEvents(req, res, next) {
    try {
      const filters = {
        page: parseInt(req.query.page) || 1,
        pageSize: parseInt(req.query.pageSize) || 25,
        from: req.query.from,
        to: req.query.to,
        company_id: req.query.company_id,
        branch_id: req.query.branch_id,
        actor_user_id: req.query.actor_user_id,
        event_name: req.query.event_name ? (Array.isArray(req.query.event_name) ? req.query.event_name : [req.query.event_name]) : undefined,
        device_type: req.query.device_type,
        search: req.query.search,
      };

      const result = await BehaviourService.getBehaviourEvents(filters);
      return success(res, result, 'Behaviour events retrieved successfully');
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /admin/behaviour/export
   * Export behavior events to CSV
   */
  async exportBehaviourEvents(req, res, next) {
    try {
      const filters = {
        from: req.query.from,
        to: req.query.to,
        company_id: req.query.company_id,
        branch_id: req.query.branch_id,
        actor_user_id: req.query.actor_user_id,
        event_name: req.query.event_name ? (Array.isArray(req.query.event_name) ? req.query.event_name : [req.query.event_name]) : undefined,
        device_type: req.query.device_type,
        search: req.query.search,
      };

      const csv = await BehaviourService.exportBehaviourEvents(filters);
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=behaviour-events-${new Date().toISOString().split('T')[0]}.csv`);
      res.send(csv);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new BehaviourController();



const ActivityService = require('../services/ActivityService');
const { success } = require('../utils/response');

class ActivityController {
  /**
   * GET /admin/activity
   * Get activity events with filters
   */
  async getActivities(req, res, next) {
    try {
      const filters = {
        page: parseInt(req.query.page) || 1,
        pageSize: parseInt(req.query.pageSize) || 25,
        from: req.query.from,
        to: req.query.to,
        company_id: req.query.company_id,
        branch_id: req.query.branch_id,
        actor_user_id: req.query.actor_user_id,
        action: req.query.action ? (Array.isArray(req.query.action) ? req.query.action : [req.query.action]) : undefined,
        entity_type: req.query.entity_type ? (Array.isArray(req.query.entity_type) ? req.query.entity_type : [req.query.entity_type]) : undefined,
        search: req.query.search,
      };

      const result = await ActivityService.getActivities(filters);
      return success(res, result, 'Activities retrieved successfully');
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /admin/activity/export
   * Export activities to CSV
   */
  async exportActivities(req, res, next) {
    try {
      const filters = {
        from: req.query.from,
        to: req.query.to,
        company_id: req.query.company_id,
        branch_id: req.query.branch_id,
        actor_user_id: req.query.actor_user_id,
        action: req.query.action ? (Array.isArray(req.query.action) ? req.query.action : [req.query.action]) : undefined,
        entity_type: req.query.entity_type ? (Array.isArray(req.query.entity_type) ? req.query.entity_type : [req.query.entity_type]) : undefined,
        search: req.query.search,
      };

      const csv = await ActivityService.exportActivities(filters);
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=activities-${new Date().toISOString().split('T')[0]}.csv`);
      res.send(csv);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ActivityController();



const BaseService = require('./BaseService');
const { AuditLog, User } = require('../models');
const { Op } = require('sequelize');

class BehaviourService extends BaseService {
  constructor() {
    super(AuditLog);
  }

  /**
   * Get behavior events with filters and pagination
   */
  async getBehaviourEvents(filters = {}) {
    const {
      page = 1,
      pageSize = 25,
      from,
      to,
      company_id,
      branch_id,
      actor_user_id,
      event_name,
      device_type,
      search,
    } = filters;

    const where = {
      entity_type: 'telemetry', // Only get telemetry events
    };

    // Date range
    if (from || to) {
      where.created_at = {};
      if (from) {
        where.created_at[Op.gte] = new Date(from);
      }
      if (to) {
        where.created_at[Op.lte] = new Date(to + 'T23:59:59');
      }
    }

    // Actor filter
    if (actor_user_id) {
      where.actor_user_id = actor_user_id;
    }

    // Event name filter (can be array)
    if (event_name) {
      if (Array.isArray(event_name)) {
        where.action = { [Op.in]: event_name };
      } else {
        where.action = event_name;
      }
    }

    // Search (entity_id or user email or page_path)
    if (search) {
      where[Op.or] = [
        { entity_id: { [Op.like]: `%${search}%` } },
        { '$actor.email$': { [Op.like]: `%${search}%` } },
        { metadata: { [Op.like]: `%"page_path":"%${search}%"%` } },
      ];
    }

    const offset = (page - 1) * pageSize;
    const limit = pageSize;

    const { count, rows } = await AuditLog.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'actor',
          attributes: ['id', 'email', 'first_name', 'last_name'],
          required: false,
        },
      ],
      order: [['created_at', 'DESC']],
      limit,
      offset,
    });

    // Enrich with company/branch/device from metadata and filter
    let enriched = rows.map(row => {
      const data = row.toJSON();
      const metadata = data.metadata || {};
      
      return {
        ...data,
        event_name: data.action, // action stores event_name
        company_id: metadata.company_id || null,
        branch_id: metadata.branch_id || null,
        session_id: metadata.session_id || null,
        page_path: metadata.page_path || null,
        referrer: metadata.referrer || null,
        device_type: metadata.device_type || 'unknown',
        properties: metadata,
        actor_name: data.actor ? `${data.actor.first_name} ${data.actor.last_name}` : 'Anonymous',
        actor_email: data.actor?.email || null,
      };
    });

    // Filter by company_id, branch_id, device_type from metadata (post-query filter)
    if (company_id) {
      enriched = enriched.filter(item => item.company_id === company_id);
    }
    if (branch_id) {
      enriched = enriched.filter(item => item.branch_id === branch_id);
    }
    if (device_type) {
      enriched = enriched.filter(item => item.device_type === device_type);
    }

    // Recalculate count if filtered
    const finalCount = (company_id || branch_id || device_type) ? enriched.length : count;

    return {
      items: enriched,
      total: finalCount,
      page,
      pageSize,
      totalPages: Math.ceil(finalCount / pageSize),
    };
  }

  /**
   * Export behavior events to CSV format
   */
  async exportBehaviourEvents(filters = {}) {
    const events = await this.getBehaviourEvents({ ...filters, page: 1, pageSize: 10000 });
    
    const headers = ['Time', 'User', 'Email', 'Event', 'Company', 'Branch', 'Page/Route', 'Device', 'Session ID'];
    const rows = events.items.map(item => [
      item.created_at,
      item.actor_name,
      item.actor_email || '',
      item.event_name,
      item.company_id || '',
      item.branch_id || '',
      item.page_path || '',
      item.device_type,
      item.session_id || '',
    ]);

    const csv = [headers, ...rows].map(row => 
      row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ).join('\n');

    return csv;
  }
}

module.exports = new BehaviourService();



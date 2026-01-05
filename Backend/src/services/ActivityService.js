const BaseService = require('./BaseService');
const { AuditLog, User, Company, Branch } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

class ActivityService extends BaseService {
  constructor() {
    super(AuditLog);
  }

  /**
   * Get activity events with filters and pagination
   */
  async getActivities(filters = {}, pagination = {}) {
    const {
      page = 1,
      pageSize = 25,
      from,
      to,
      company_id,
      branch_id,
      actor_user_id,
      action,
      entity_type,
      search,
    } = filters;

    const where = {};

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

    // Action filter (can be array)
    if (action) {
      if (Array.isArray(action)) {
        where.action = { [Op.in]: action };
      } else {
        where.action = action;
      }
    }

    // Entity type filter (can be array)
    if (entity_type) {
      if (Array.isArray(entity_type)) {
        where.entity_type = { [Op.in]: entity_type };
      } else {
        where.entity_type = entity_type;
      }
    }

    // Search (entity_id or user email)
    if (search) {
      where[Op.or] = [
        { entity_id: { [Op.like]: `%${search}%` } },
        { '$actor.email$': { [Op.like]: `%${search}%` } },
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

    // Enrich with company/branch names from metadata and filter by company/branch if needed
    let enriched = rows.map(row => {
      const data = row.toJSON();
      const metadata = data.metadata || {};
      
      return {
        ...data,
        company_id: metadata.company_id || null,
        branch_id: metadata.branch_id || null,
        actor_name: data.actor ? `${data.actor.first_name} ${data.actor.last_name}` : 'System',
        actor_email: data.actor?.email || null,
      };
    });

    // Filter by company_id and branch_id from metadata (client-side filter since JSON query is complex)
    if (company_id) {
      enriched = enriched.filter(item => item.company_id === company_id);
    }
    if (branch_id) {
      enriched = enriched.filter(item => item.branch_id === branch_id);
    }

    // Recalculate count if filtered
    const finalCount = (company_id || branch_id) ? enriched.length : count;

    return {
      items: filtered,
      total: finalCount,
      page,
      pageSize,
      totalPages: Math.ceil(finalCount / pageSize),
    };
  }

  /**
   * Export activities to CSV format
   */
  async exportActivities(filters = {}) {
    const activities = await this.getActivities(filters, { page: 1, pageSize: 10000 });
    
    const headers = ['Time', 'Actor', 'Email', 'Company', 'Branch', 'Action', 'Entity Type', 'Entity ID', 'IP Address'];
    const rows = activities.items.map(item => [
      item.created_at,
      item.actor_name,
      item.actor_email || '',
      item.company_id || '',
      item.branch_id || '',
      item.action,
      item.entity_type,
      item.entity_id,
      item.ip_address || '',
    ]);

    const csv = [headers, ...rows].map(row => 
      row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ).join('\n');

    return csv;
  }
}

module.exports = new ActivityService();

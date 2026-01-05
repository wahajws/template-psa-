const BaseService = require('../services/BaseService');
const { success, error, paginated } = require('../utils/response');
const { NotFoundError } = require('../utils/errors');
const { logActivity } = require('../middlewares/activity');

class BaseController {
  constructor(service) {
    this.service = service;
  }

  async getAll(req, res, next) {
    try {
      const { page = 1, pageSize = 10, ...filters } = req.query;
      const options = this.buildQueryOptions(filters, req);
      
      const result = await this.service.paginate(
        parseInt(page),
        parseInt(pageSize),
        options
      );

      return paginated(res, result.data, result.pagination);
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const options = this.buildQueryOptions({}, req);
      const record = await this.service.findById(id, options);
      return success(res, record);
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const data = this.prepareCreateData(req);
      const record = await this.service.create(data);
      
      // Log activity for company creation
      if (req.path && req.path.includes('/platform/companies')) {
        await logActivity(req, {
          action: 'company_created',
          entity_type: 'company',
          entity_id: record.id,
          after_snapshot: record.toJSON ? record.toJSON() : record,
        });
      }
      
      return success(res, record, 'Created successfully', 201);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const oldRecord = await this.service.findById(id);
      const data = this.prepareUpdateData(req);
      const record = await this.service.update(id, data);
      
      // Log activity for company updates
      if (req.path && req.path.includes('/platform/companies')) {
        const action = data.status === 'suspended' ? 'company_suspended' : 'company_updated';
        await logActivity(req, {
          action,
          entity_type: 'company',
          entity_id: record.id,
          before_snapshot: oldRecord.toJSON ? oldRecord.toJSON() : oldRecord,
          after_snapshot: record.toJSON ? record.toJSON() : record,
        });
      }
      
      return success(res, record, 'Updated successfully');
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await this.service.delete(id);
      return success(res, null, 'Deleted successfully');
    } catch (err) {
      next(err);
    }
  }

  buildQueryOptions(filters, req) {
    const options = {
      where: {},
      include: []
    };

    if (req.companyId) {
      options.where.company_id = req.companyId;
    }

    if (req.branchId) {
      options.where.branch_id = req.branchId;
    }

    return options;
  }

  prepareCreateData(req) {
    const data = { ...req.body };
    
    if (req.user) {
      data.created_by = req.user.id;
    }

    if (req.companyId) {
      data.company_id = req.companyId;
    }

    if (req.branchId) {
      data.branch_id = req.branchId;
    }

    // Auto-generate slug for Company if name is provided but slug is not
    if (data.name && !data.slug && req.path && req.path.includes('companies')) {
      data.slug = data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    // Auto-generate slug for Branch if name is provided but slug is not
    if (data.name && !data.slug && req.path && req.path.includes('branches')) {
      data.slug = data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    return data;
  }

  prepareUpdateData(req) {
    const data = { ...req.body };
    
    if (req.user) {
      data.updated_by = req.user.id;
    }

    return data;
  }
}

module.exports = BaseController;



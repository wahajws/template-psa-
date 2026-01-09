const BaseService = require('./BaseService');
const { Branch, Company } = require('../models');
const { generateUUID } = require('../utils/uuid');
const { ConflictError, NotFoundError } = require('../utils/errors');
const { Op } = require('sequelize');

// small helper
const slugify = (s = '') =>
  s
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

class BranchService extends BaseService {
  constructor() {
    super(Branch);
  }

  async list(companyId) {
    return Branch.findAll({
      where: {
        company_id: companyId,
        deleted_at: { [Op.is]: null },
      },
      order: [['created_at', 'DESC']],
    });
  }

  async getById(companyId, branchId) {
    const branch = await Branch.findOne({
      where: {
        id: branchId,
        company_id: companyId,
        deleted_at: { [Op.is]: null },
      },
      // optional if you want related data in dashboard:
      // include: [
      //   { model: require('../models').Court, as: 'courts' },
      //   { model: require('../models').BranchContact, as: 'contacts' },
      // ],
    });

    if (!branch) throw new NotFoundError('Branch not found');
    return branch;
  }

  async create(userId, companyId, data = {}) {
    // optional: make sure company exists
    const company = await Company.findOne({
      where: { id: companyId, deleted_at: { [Op.is]: null } },
    });
    if (!company) throw new NotFoundError('Company not found');

    const slug = data.slug ? slugify(data.slug) : slugify(data.name);
    if (!slug) throw new ConflictError('Branch slug is required');

    const existing = await Branch.findOne({
      where: {
        company_id: companyId,
        slug,
        deleted_at: { [Op.is]: null },
      },
    });
    if (existing) throw new ConflictError('Branch slug already exists for this company');

    return Branch.create({
      id: generateUUID(),
      company_id: companyId,

      name: data.name,
      slug,
      description: data.description || null,

      address_line1: data.address_line1,
      address_line2: data.address_line2 || null,
      city: data.city,
      state: data.state || null,
      postal_code: data.postal_code || null,
      country: data.country,

      latitude: data.latitude,
      longitude: data.longitude,

      timezone: data.timezone || 'UTC',
      status: data.status || 'active',

      created_by: userId,
      updated_by: userId,
    });
  }

  async update(userId, companyId, branchId, data = {}) {
    const branch = await Branch.findOne({
      where: {
        id: branchId,
        company_id: companyId,
        deleted_at: { [Op.is]: null },
      },
    });
    if (!branch) throw new NotFoundError('Branch not found');

    const patch = { ...data };

    if (patch.slug || patch.name) {
      patch.slug = slugify(patch.slug || patch.name || branch.slug);

      const existing = await Branch.findOne({
        where: {
          company_id: companyId,
          slug: patch.slug,
          id: { [Op.ne]: branchId },
          deleted_at: { [Op.is]: null },
        },
      });
      if (existing) throw new ConflictError('Branch slug already exists for this company');
    }

    patch.updated_by = userId;

    await branch.update(patch);
    return branch;
  }

  async remove(userId, companyId, branchId) {
    const branch = await Branch.findOne({
      where: {
        id: branchId,
        company_id: companyId,
        deleted_at: { [Op.is]: null },
      },
    });
    if (!branch) return null;

    await branch.update({
      status: 'deleted',
      deleted_at: new Date(),
      updated_by: userId,
    });

    return branch;
  }
}

module.exports = new BranchService();

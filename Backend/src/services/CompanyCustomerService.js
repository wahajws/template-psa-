const BaseService = require('./BaseService');
const { CompanyCustomer, Company } = require('../models');
const { generateUUID } = require('../utils/uuid');
const { ConflictError } = require('../utils/errors');
const { Op } = require('sequelize');

class CompanyCustomerService extends BaseService {
  constructor() {
    super(CompanyCustomer);
  }

  async subscribe(userId, companyId, data = {}) {
    const existing = await CompanyCustomer.findOne({
      where: {
        user_id: userId,
        company_id: companyId,
        status: 'active',
        deleted_at: { [Op.is]: null }
      }
    });

    if (existing) {
      throw new ConflictError('Already subscribed to this company');
    }

    return CompanyCustomer.create({
      id: generateUUID(),
      user_id: userId,
      company_id: companyId,
      status: 'active',
      marketing_opt_in: data.marketing_opt_in || false,
      default_branch_id: data.default_branch_id || null,
      created_by: userId
    });
  }

  async unsubscribe(userId, companyId) {
    const subscription = await CompanyCustomer.findOne({
      where: {
        user_id: userId,
        company_id: companyId,
        status: 'active',
        deleted_at: { [Op.is]: null }
      }
    });

    if (!subscription) {
      return null;
    }

    await subscription.update({
      status: 'left',
      left_at: new Date()
    });

    return subscription;
  }

  async getUserCompanies(userId) {
    return CompanyCustomer.findAll({
      where: {
        user_id: userId,
        status: 'active',
        deleted_at: { [Op.is]: null }
      },
      include: [{
        model: Company,
        as: 'company'
      }]
    });
  }
}

module.exports = new CompanyCustomerService();




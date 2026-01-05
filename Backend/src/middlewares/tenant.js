const { NotFoundError, ForbiddenError } = require('../utils/errors');
const { Company, Branch, CompanyCustomer } = require('../models');
const { Op } = require('sequelize');

async function validateCompany(req, res, next) {
  try {
    const companyId = req.params.companyId;
    
    if (!companyId) {
      return next();
    }

    const company = await Company.findOne({
      where: { 
        id: companyId,
        deleted_at: null 
      }
    });

    if (!company || company.status === 'deleted') {
      throw new NotFoundError('Company');
    }

    req.company = company;
    req.companyId = companyId;
    next();
  } catch (err) {
    next(err);
  }
}

async function validateBranch(req, res, next) {
  try {
    const branchId = req.params.branchId;
    const companyId = req.params.companyId || req.companyId;

    if (!branchId) {
      return next();
    }

    const branch = await Branch.findOne({
      where: {
        id: branchId,
        company_id: companyId,
        deleted_at: null
      }
    });

    if (!branch || branch.status === 'deleted') {
      throw new NotFoundError('Branch');
    }

    req.branch = branch;
    req.branchId = branchId;
    next();
  } catch (err) {
    next(err);
  }
}

async function requireCompanySubscription(req, res, next) {
  try {
    if (!req.user) {
      throw new ForbiddenError('Authentication required');
    }

    const companyId = req.params.companyId || req.companyId;
    const userId = req.user.id;

    if (!companyId) {
      return next();
    }

    const subscription = await CompanyCustomer.findOne({
      where: {
        user_id: userId,
        company_id: companyId,
        status: 'active',
        deleted_at: null
      }
    });

    if (!subscription) {
      throw new ForbiddenError('Not subscribed to this company');
    }

    req.companySubscription = subscription;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  validateCompany,
  validateBranch,
  requireCompanySubscription
};


const { ForbiddenError } = require('../utils/errors');
const { UserRole, Role } = require('../models');
const { Op } = require('sequelize');

function requireRole(...allowedRoles) {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        throw new ForbiddenError('Authentication required');
      }

      const userId = req.user.id;
      const companyId = req.companyId || req.params.companyId;
      const branchId = req.branchId || req.params.branchId;

      const where = {
        user_id: userId,
        deleted_at: null
      };

      if (companyId) {
        where.company_id = companyId;
      } else {
        where.company_id = { [Op.is]: null };
      }

      if (branchId) {
        where.branch_id = branchId;
      } else if (companyId) {
        where.branch_id = { [Op.is]: null };
      } else {
        where.branch_id = { [Op.is]: null };
      }

      const userRoles = await UserRole.findAll({
        where,
        include: [{
          model: Role,
          as: 'role',
          where: {
            role_type: { [Op.in]: allowedRoles },
            deleted_at: null
          }
        }]
      });

      if (userRoles.length === 0) {
        throw new ForbiddenError(`Required role: ${allowedRoles.join(' or ')}`);
      }

      req.userRoles = userRoles.map(ur => ur.role.role_type);
      next();
    } catch (err) {
      next(err);
    }
  };
}

function requireAnyRole(...allowedRoles) {
  return requireRole(...allowedRoles);
}

function requirePlatformAdmin(req, res, next) {
  return requireRole('platform_super_admin')(req, res, next);
}

function requireCompanyAdmin(req, res, next) {
  return requireRole('platform_super_admin', 'company_admin')(req, res, next);
}

function requireBranchManager(req, res, next) {
  return requireRole('platform_super_admin', 'company_admin', 'branch_manager')(req, res, next);
}

function requireCustomerOrAdmin(...adminRoles) {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        throw new ForbiddenError('Authentication required');
      }

      const userId = req.user.id;
      const companyId = req.companyId || req.params.companyId;
      const resourceUserId = req.params.userId || req.body.userId;

      if (resourceUserId === userId) {
        return next();
      }

      return requireRole(...adminRoles)(req, res, next);
    } catch (err) {
      next(err);
    }
  };
}

module.exports = {
  requireRole,
  requireAnyRole,
  requirePlatformAdmin,
  requireCompanyAdmin,
  requireBranchManager,
  requireCustomerOrAdmin
};



const express = require('express');
const router = express.Router({ mergeParams: true });
const BaseService = require('../services/BaseService');
const CrudRouterFactory = require('./CrudRouterFactory');
const { authenticate } = require('../middlewares/auth');
const { validateCompany, validateBranch } = require('../middlewares/tenant');
const { requirePlatformAdmin, requireCompanyAdmin } = require('../middlewares/rbac');
const {
  Company, Branch, BranchContact, Court, Service, MembershipPlan,
  MembershipPlanBenefit, Campaign, PromoCode, NotificationTemplate
} = require('../models');

// Platform Admin routes - Companies CRUD
const platformCompaniesRouter = express.Router();
platformCompaniesRouter.use(authenticate, requirePlatformAdmin);
platformCompaniesRouter.use('/', CrudRouterFactory.create(new BaseService(Company), {
  requireAuth: true,
  rbac: requirePlatformAdmin
}));
router.use('/platform/companies', platformCompaniesRouter);

// Company Admin routes
const companyAdminRouter = express.Router({ mergeParams: true });
companyAdminRouter.use(authenticate, validateCompany, requireCompanyAdmin);

// Branches CRUD
companyAdminRouter.use('/branches', CrudRouterFactory.create(new BaseService(Branch), {
  requireAuth: true,
  requireCompany: true,
  rbac: requireCompanyAdmin
}));

// Branch Contacts CRUD
companyAdminRouter.param('branchId', validateBranch);
companyAdminRouter.use('/branches/:branchId/contacts', CrudRouterFactory.create(new BaseService(BranchContact), {
  requireAuth: true,
  requireCompany: true,
  requireBranch: true,
  rbac: requireCompanyAdmin
}));

// Courts CRUD
companyAdminRouter.use('/branches/:branchId/courts', CrudRouterFactory.create(new BaseService(Court), {
  requireAuth: true,
  requireCompany: true,
  requireBranch: true,
  rbac: requireCompanyAdmin
}));

// Services CRUD
companyAdminRouter.use('/services', CrudRouterFactory.create(new BaseService(Service), {
  requireAuth: true,
  requireCompany: true,
  rbac: requireCompanyAdmin
}));

// Membership Plans CRUD
companyAdminRouter.use('/membership-plans', CrudRouterFactory.create(new BaseService(MembershipPlan), {
  requireAuth: true,
  requireCompany: true,
  rbac: requireCompanyAdmin
}));

// Membership Plan Benefits CRUD
companyAdminRouter.use('/membership-plans/:planId/benefits', CrudRouterFactory.create(new BaseService(MembershipPlanBenefit), {
  requireAuth: true,
  requireCompany: true,
  rbac: requireCompanyAdmin
}));

// Campaigns CRUD
companyAdminRouter.use('/campaigns', CrudRouterFactory.create(new BaseService(Campaign), {
  requireAuth: true,
  requireCompany: true,
  rbac: requireCompanyAdmin
}));

// Promo Codes CRUD
companyAdminRouter.use('/promo-codes', CrudRouterFactory.create(new BaseService(PromoCode), {
  requireAuth: true,
  requireCompany: true,
  rbac: requireCompanyAdmin
}));

// Notification Templates CRUD
companyAdminRouter.use('/notification-templates', CrudRouterFactory.create(new BaseService(NotificationTemplate), {
  requireAuth: true,
  requireCompany: true,
  rbac: requireCompanyAdmin
}));

router.use('/companies/:companyId', companyAdminRouter);

// Activity routes
const activityRoutes = require('./activity');
router.use('/activity', activityRoutes);

module.exports = router;

const express = require('express');
const router = express.Router({ mergeParams: true });
const BaseService = require('../services/BaseService');
const CrudRouterFactory = require('./CrudRouterFactory');
const { authenticate } = require('../middlewares/auth');
const { validateCompany, validateBranch } = require('../middlewares/tenant');
const { requirePlatformAdmin, requireCompanyAdmin } = require('../middlewares/rbac');
const {
  Company, Branch, BranchContact, BranchAmenity, BranchStaff, BranchBusinessHours, BranchSpecialHours,
  Court, CourtFeature, CourtRateRule, CourtTimeSlot, ResourceBlock,
  Service, ServiceBranchAvailability,
  MembershipPlan, MembershipPlanBenefit, CustomerMembership, MembershipCycle, MembershipUsageLedger,
  Campaign, CampaignRule, PromoCode, DiscountApplication,
  Booking, BookingItem, BookingParticipant, BookingChangeLog, BookingWaitlist, CourtReservationLock,
  Payment, PaymentAttempt, Refund, Invoice, InvoiceItem, CustomerWalletLedger,
  GiftCard, GiftCardRedemption,
  NotificationTemplate, NotificationOutbox, NotificationDeliveryLog, UserNotificationPreference,
  Review, SupportTicket, SupportTicketMessage,
  Group, GroupMember, GroupBooking,
  TaxRate,
  Role, Permission, RolePermission, UserRole, User,
  AuthIdentity, AuthSession, OtpCode, CompanyCustomer,
  AuditLog, MediaFile, MediaVariant
} = require('../models');

// Platform Admin routes - Companies CRUD
const platformCompaniesRouter = express.Router();
platformCompaniesRouter.use(authenticate, requirePlatformAdmin);
platformCompaniesRouter.use('/', CrudRouterFactory.create(new BaseService(Company), {
  requireAuth: true,
  rbac: requirePlatformAdmin
}));
router.use('/platform/companies', platformCompaniesRouter);

// Platform Admin routes - Roles CRUD
const platformRolesRouter = express.Router();
platformRolesRouter.use(authenticate, requirePlatformAdmin);
platformRolesRouter.use('/', CrudRouterFactory.create(new BaseService(Role), {
  requireAuth: true,
  rbac: requirePlatformAdmin
}));
router.use('/platform/roles', platformRolesRouter);

// Platform Admin routes - Permissions CRUD
const platformPermissionsRouter = express.Router();
platformPermissionsRouter.use(authenticate, requirePlatformAdmin);
platformPermissionsRouter.use('/', CrudRouterFactory.create(new BaseService(Permission), {
  requireAuth: true,
  rbac: requirePlatformAdmin
}));
router.use('/platform/permissions', platformPermissionsRouter);

// Platform Admin routes - Users CRUD
const platformUsersRouter = express.Router();
platformUsersRouter.use(authenticate, requirePlatformAdmin);
platformUsersRouter.use('/', CrudRouterFactory.create(new BaseService(User), {
  requireAuth: true,
  rbac: requirePlatformAdmin
}));
router.use('/platform/users', platformUsersRouter);

// Platform Admin routes - All other tables (read-only or full CRUD based on model)
const createPlatformAdminRoute = (model, endpoint, options = {}) => {
  const router = express.Router();
  router.use(authenticate, requirePlatformAdmin);
  router.use('/', CrudRouterFactory.create(new BaseService(model), {
    requireAuth: true,
    rbac: requirePlatformAdmin,
    ...options
  }));
  return router;
};

// Additional Platform Admin routes for all tables
router.use('/platform/user-roles', createPlatformAdminRoute(UserRole));
router.use('/platform/role-permissions', createPlatformAdminRoute(RolePermission));
router.use('/platform/auth-identities', createPlatformAdminRoute(AuthIdentity));
router.use('/platform/auth-sessions', createPlatformAdminRoute(AuthSession));
router.use('/platform/otp-codes', createPlatformAdminRoute(OtpCode));
router.use('/platform/company-customers', createPlatformAdminRoute(CompanyCustomer));
router.use('/platform/branches', createPlatformAdminRoute(Branch));
router.use('/platform/branch-contacts', createPlatformAdminRoute(BranchContact));
router.use('/platform/branch-amenities', createPlatformAdminRoute(BranchAmenity));
router.use('/platform/branch-staff', createPlatformAdminRoute(BranchStaff));
router.use('/platform/branch-business-hours', createPlatformAdminRoute(BranchBusinessHours));
router.use('/platform/branch-special-hours', createPlatformAdminRoute(BranchSpecialHours));
router.use('/platform/courts', createPlatformAdminRoute(Court));
router.use('/platform/court-features', createPlatformAdminRoute(CourtFeature));
router.use('/platform/court-rate-rules', createPlatformAdminRoute(CourtRateRule));
router.use('/platform/court-time-slots', createPlatformAdminRoute(CourtTimeSlot));
router.use('/platform/resource-blocks', createPlatformAdminRoute(ResourceBlock));
router.use('/platform/services', createPlatformAdminRoute(Service));
router.use('/platform/service-branch-availability', createPlatformAdminRoute(ServiceBranchAvailability));
router.use('/platform/membership-plans', createPlatformAdminRoute(MembershipPlan));
router.use('/platform/membership-plan-benefits', createPlatformAdminRoute(MembershipPlanBenefit));
router.use('/platform/customer-memberships', createPlatformAdminRoute(CustomerMembership));
router.use('/platform/membership-cycles', createPlatformAdminRoute(MembershipCycle));
router.use('/platform/membership-usage-ledger', createPlatformAdminRoute(MembershipUsageLedger));
router.use('/platform/campaigns', createPlatformAdminRoute(Campaign));
router.use('/platform/campaign-rules', createPlatformAdminRoute(CampaignRule));
router.use('/platform/promo-codes', createPlatformAdminRoute(PromoCode));
router.use('/platform/discount-applications', createPlatformAdminRoute(DiscountApplication));
router.use('/platform/bookings', createPlatformAdminRoute(Booking));
router.use('/platform/booking-items', createPlatformAdminRoute(BookingItem));
router.use('/platform/booking-participants', createPlatformAdminRoute(BookingParticipant));
router.use('/platform/booking-change-log', createPlatformAdminRoute(BookingChangeLog));
router.use('/platform/booking-waitlist', createPlatformAdminRoute(BookingWaitlist));
router.use('/platform/court-reservation-locks', createPlatformAdminRoute(CourtReservationLock));
router.use('/platform/payments', createPlatformAdminRoute(Payment));
router.use('/platform/payment-attempts', createPlatformAdminRoute(PaymentAttempt));
router.use('/platform/refunds', createPlatformAdminRoute(Refund));
router.use('/platform/invoices', createPlatformAdminRoute(Invoice));
router.use('/platform/invoice-items', createPlatformAdminRoute(InvoiceItem));
router.use('/platform/customer-wallet-ledger', createPlatformAdminRoute(CustomerWalletLedger));
router.use('/platform/gift-cards', createPlatformAdminRoute(GiftCard));
router.use('/platform/gift-card-redemptions', createPlatformAdminRoute(GiftCardRedemption));
router.use('/platform/notification-templates', createPlatformAdminRoute(NotificationTemplate));
router.use('/platform/notifications-outbox', createPlatformAdminRoute(NotificationOutbox));
router.use('/platform/notification-delivery-logs', createPlatformAdminRoute(NotificationDeliveryLog));
router.use('/platform/user-notification-preferences', createPlatformAdminRoute(UserNotificationPreference));
router.use('/platform/reviews', createPlatformAdminRoute(Review));
router.use('/platform/support-tickets', createPlatformAdminRoute(SupportTicket));
router.use('/platform/support-ticket-messages', createPlatformAdminRoute(SupportTicketMessage));
router.use('/platform/groups', createPlatformAdminRoute(Group));
router.use('/platform/group-members', createPlatformAdminRoute(GroupMember));
router.use('/platform/group-bookings', createPlatformAdminRoute(GroupBooking));
router.use('/platform/tax-rates', createPlatformAdminRoute(TaxRate));
router.use('/platform/media-files', createPlatformAdminRoute(MediaFile));
router.use('/platform/media-variants', createPlatformAdminRoute(MediaVariant));

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

# API Audit Report - Multi-Tenant Sports Booking Platform

**Date:** 2026-01-04  
**Auditor:** Senior Backend QA + API Architect  
**Codebase:** Node.js + Express + Sequelize (MySQL 8)

---

## A) CONSOLE READINESS SUMMARY

### Platform Admin Console: **PARTIAL** ⚠️
**Reason:** 
- ✅ Companies CRUD exists via `/api/admin/platform/companies`
- ❌ Missing: Company suspension/activation endpoints (status management)
- ❌ Missing: Company details with aggregated stats (branch count, booking count, revenue)
- ❌ Missing: Audit logs read endpoints
- ❌ Missing: RBAC management endpoints (role/permission assignment beyond seed)
- 🟡 Partial: No explicit "view company details with stats" endpoint

### Company Console: **PARTIAL** ⚠️
**Reason:**
- ✅ Core CRUD exists: Branches, Contacts, Courts, Services, Membership Plans, Campaigns, Promo Codes
- ❌ Missing: Branch Business Hours CRUD
- ❌ Missing: Branch Special Hours CRUD
- ❌ Missing: Resource Blocks CRUD (maintenance/closure management)
- ❌ Missing: Branch Amenities CRUD
- ❌ Missing: Branch Staff CRUD
- ❌ Missing: Court Rate Rules CRUD (pricing management)
- ❌ Missing: Company profile read/update endpoint
- ❌ Missing: Bookings list/filter across all branches (admin view)
- ❌ Missing: Payments/invoices/refunds list endpoints (admin view)
- 🟡 Partial: No aggregated dashboard data endpoints

### Branch Console: **NOT READY** ❌
**Reason:**
- ❌ Missing: All branch-specific management endpoints
- ❌ Missing: Branch Business Hours CRUD
- ❌ Missing: Branch Special Hours CRUD
- ❌ Missing: Resource Blocks CRUD
- ❌ Missing: Branch profile update
- ❌ Missing: Branch bookings list/filter (branch-scoped)
- ❌ Missing: Booking cancel/reschedule (branch manager permissions)
- ❌ Missing: Branch staff management
- ❌ Missing: Court management (branch-scoped)
- ❌ Missing: Branch media upload management
- ⚠️ **Critical:** No routes exist for branch_manager role operations

---

## B) REQUIRED ENDPOINT CHECKLIST (BY CONSOLE)

### 1. PLATFORM ADMIN CONSOLE (platform_super_admin)

#### Companies Management
- ✅ `GET /api/admin/platform/companies` - List companies (via CrudRouterFactory)
- ✅ `POST /api/admin/platform/companies` - Create company
- ✅ `GET /api/admin/platform/companies/:id` - Get company
- ✅ `PATCH /api/admin/platform/companies/:id` - Update company
- ✅ `DELETE /api/admin/platform/companies/:id` - Delete company
- ❌ `PATCH /api/admin/platform/companies/:id/suspend` - Suspend company (status change)
- ❌ `PATCH /api/admin/platform/companies/:id/activate` - Activate company
- ❌ `GET /api/admin/platform/companies/:id/stats` - Company stats (branches, bookings, revenue)

#### RBAC Management
- ❌ `GET /api/admin/platform/roles` - List roles
- ❌ `GET /api/admin/platform/permissions` - List permissions
- ❌ `POST /api/admin/platform/users/:userId/roles` - Assign role to user
- ❌ `DELETE /api/admin/platform/users/:userId/roles/:roleId` - Remove role

#### Audit & Monitoring
- ❌ `GET /api/admin/platform/audit-logs` - List audit logs
- ❌ `GET /api/admin/platform/audit-logs/:id` - Get audit log details

---

### 2. COMPANY CONSOLE (company_admin)

#### Company Profile
- ❌ `GET /api/admin/companies/:companyId/profile` - Get company profile
- ❌ `PATCH /api/admin/companies/:companyId/profile` - Update company profile

#### Branches Management
- ✅ `GET /api/admin/companies/:companyId/branches` - List branches
- ✅ `POST /api/admin/companies/:companyId/branches` - Create branch
- ✅ `GET /api/admin/companies/:companyId/branches/:id` - Get branch
- ✅ `PATCH /api/admin/companies/:companyId/branches/:id` - Update branch
- ✅ `DELETE /api/admin/companies/:companyId/branches/:id` - Delete branch
- ❌ `GET /api/admin/companies/:companyId/branches/:id/stats` - Branch stats

#### Branch Business Hours
- ❌ `GET /api/admin/companies/:companyId/branches/:branchId/business-hours` - List business hours
- ❌ `POST /api/admin/companies/:companyId/branches/:branchId/business-hours` - Create business hours
- ❌ `PATCH /api/admin/companies/:companyId/branches/:branchId/business-hours/:id` - Update business hours
- ❌ `DELETE /api/admin/companies/:companyId/branches/:branchId/business-hours/:id` - Delete business hours

#### Branch Special Hours
- ❌ `GET /api/admin/companies/:companyId/branches/:branchId/special-hours` - List special hours
- ❌ `POST /api/admin/companies/:companyId/branches/:branchId/special-hours` - Create special hours
- ❌ `PATCH /api/admin/companies/:companyId/branches/:branchId/special-hours/:id` - Update special hours
- ❌ `DELETE /api/admin/companies/:companyId/branches/:branchId/special-hours/:id` - Delete special hours

#### Resource Blocks (Maintenance/Closures)
- ❌ `GET /api/admin/companies/:companyId/branches/:branchId/resource-blocks` - List resource blocks
- ❌ `POST /api/admin/companies/:companyId/branches/:branchId/resource-blocks` - Create resource block
- ❌ `PATCH /api/admin/companies/:companyId/branches/:branchId/resource-blocks/:id` - Update resource block
- ❌ `DELETE /api/admin/companies/:companyId/branches/:branchId/resource-blocks/:id` - Delete resource block

#### Branch Contacts
- ✅ `GET /api/admin/companies/:companyId/branches/:branchId/contacts` - List contacts
- ✅ `POST /api/admin/companies/:companyId/branches/:branchId/contacts` - Create contact
- ✅ `GET /api/admin/companies/:companyId/branches/:branchId/contacts/:id` - Get contact
- ✅ `PATCH /api/admin/companies/:companyId/branches/:branchId/contacts/:id` - Update contact
- ✅ `DELETE /api/admin/companies/:companyId/branches/:branchId/contacts/:id` - Delete contact

#### Branch Amenities
- ❌ `GET /api/admin/companies/:companyId/branches/:branchId/amenities` - List amenities
- ❌ `POST /api/admin/companies/:companyId/branches/:branchId/amenities` - Create amenity
- ❌ `PATCH /api/admin/companies/:companyId/branches/:branchId/amenities/:id` - Update amenity
- ❌ `DELETE /api/admin/companies/:companyId/branches/:branchId/amenities/:id` - Delete amenity

#### Branch Staff
- ❌ `GET /api/admin/companies/:companyId/branches/:branchId/staff` - List staff
- ❌ `POST /api/admin/companies/:companyId/branches/:branchId/staff` - Assign staff
- ❌ `DELETE /api/admin/companies/:companyId/branches/:branchId/staff/:id` - Remove staff

#### Courts Management
- ✅ `GET /api/admin/companies/:companyId/branches/:branchId/courts` - List courts
- ✅ `POST /api/admin/companies/:companyId/branches/:branchId/courts` - Create court
- ✅ `GET /api/admin/companies/:companyId/branches/:branchId/courts/:id` - Get court
- ✅ `PATCH /api/admin/companies/:companyId/branches/:branchId/courts/:id` - Update court
- ✅ `DELETE /api/admin/companies/:companyId/branches/:branchId/courts/:id` - Delete court

#### Court Rate Rules (Pricing)
- ❌ `GET /api/admin/companies/:companyId/branches/:branchId/courts/:courtId/rate-rules` - List rate rules
- ❌ `POST /api/admin/companies/:companyId/branches/:branchId/courts/:courtId/rate-rules` - Create rate rule
- ❌ `PATCH /api/admin/companies/:companyId/branches/:branchId/courts/:courtId/rate-rules/:id` - Update rate rule
- ❌ `DELETE /api/admin/companies/:companyId/branches/:branchId/courts/:courtId/rate-rules/:id` - Delete rate rule

#### Services Management
- ✅ `GET /api/admin/companies/:companyId/services` - List services
- ✅ `POST /api/admin/companies/:companyId/services` - Create service
- ✅ `GET /api/admin/companies/:companyId/services/:id` - Get service
- ✅ `PATCH /api/admin/companies/:companyId/services/:id` - Update service
- ✅ `DELETE /api/admin/companies/:companyId/services/:id` - Delete service

#### Membership Plans
- ✅ `GET /api/admin/companies/:companyId/membership-plans` - List plans
- ✅ `POST /api/admin/companies/:companyId/membership-plans` - Create plan
- ✅ `GET /api/admin/companies/:companyId/membership-plans/:id` - Get plan
- ✅ `PATCH /api/admin/companies/:companyId/membership-plans/:id` - Update plan
- ✅ `DELETE /api/admin/companies/:companyId/membership-plans/:id` - Delete plan

#### Membership Plan Benefits
- ✅ `GET /api/admin/companies/:companyId/membership-plans/:planId/benefits` - List benefits
- ✅ `POST /api/admin/companies/:companyId/membership-plans/:planId/benefits` - Create benefit
- ✅ `GET /api/admin/companies/:companyId/membership-plans/:planId/benefits/:id` - Get benefit
- ✅ `PATCH /api/admin/companies/:companyId/membership-plans/:planId/benefits/:id` - Update benefit
- ✅ `DELETE /api/admin/companies/:companyId/membership-plans/:planId/benefits/:id` - Delete benefit

#### Campaigns
- ✅ `GET /api/admin/companies/:companyId/campaigns` - List campaigns
- ✅ `POST /api/admin/companies/:companyId/campaigns` - Create campaign
- ✅ `GET /api/admin/companies/:companyId/campaigns/:id` - Get campaign
- ✅ `PATCH /api/admin/companies/:companyId/campaigns/:id` - Update campaign
- ✅ `DELETE /api/admin/companies/:companyId/campaigns/:id` - Delete campaign

#### Promo Codes
- ✅ `GET /api/admin/companies/:companyId/promo-codes` - List promo codes
- ✅ `POST /api/admin/companies/:companyId/promo-codes` - Create promo code
- ✅ `GET /api/admin/companies/:companyId/promo-codes/:id` - Get promo code
- ✅ `PATCH /api/admin/companies/:companyId/promo-codes/:id` - Update promo code
- ✅ `DELETE /api/admin/companies/:companyId/promo-codes/:id` - Delete promo code

#### Bookings (Admin View)
- ❌ `GET /api/admin/companies/:companyId/bookings` - List all bookings (across branches)
- ❌ `GET /api/admin/companies/:companyId/bookings/:bookingId` - Get booking details
- ❌ `POST /api/admin/companies/:companyId/bookings/:bookingId/cancel` - Cancel booking (admin)
- ❌ `POST /api/admin/companies/:companyId/bookings/:bookingId/reschedule` - Reschedule booking

#### Payments/Invoices/Refunds (Admin View)
- ❌ `GET /api/admin/companies/:companyId/payments` - List payments
- ❌ `GET /api/admin/companies/:companyId/invoices` - List invoices
- ❌ `GET /api/admin/companies/:companyId/refunds` - List refunds

#### Notification Templates
- ✅ `GET /api/admin/companies/:companyId/notification-templates` - List templates
- ✅ `POST /api/admin/companies/:companyId/notification-templates` - Create template
- ✅ `GET /api/admin/companies/:companyId/notification-templates/:id` - Get template
- ✅ `PATCH /api/admin/companies/:companyId/notification-templates/:id` - Update template
- ✅ `DELETE /api/admin/companies/:companyId/notification-templates/:id` - Delete template

---

### 3. BRANCH CONSOLE (branch_manager/branch_staff)

#### Branch Profile
- ❌ `GET /api/admin/companies/:companyId/branches/:branchId/profile` - Get branch profile
- ❌ `PATCH /api/admin/companies/:companyId/branches/:branchId/profile` - Update branch profile

#### Branch Business Hours
- ❌ `GET /api/admin/companies/:companyId/branches/:branchId/business-hours` - List business hours
- ❌ `POST /api/admin/companies/:companyId/branches/:branchId/business-hours` - Create business hours
- ❌ `PATCH /api/admin/companies/:companyId/branches/:branchId/business-hours/:id` - Update business hours
- ❌ `DELETE /api/admin/companies/:companyId/branches/:branchId/business-hours/:id` - Delete business hours

#### Branch Special Hours
- ❌ `GET /api/admin/companies/:companyId/branches/:branchId/special-hours` - List special hours
- ❌ `POST /api/admin/companies/:companyId/branches/:branchId/special-hours` - Create special hours
- ❌ `PATCH /api/admin/companies/:companyId/branches/:branchId/special-hours/:id` - Update special hours
- ❌ `DELETE /api/admin/companies/:companyId/branches/:branchId/special-hours/:id` - Delete special hours

#### Resource Blocks
- ❌ `GET /api/admin/companies/:companyId/branches/:branchId/resource-blocks` - List resource blocks
- ❌ `POST /api/admin/companies/:companyId/branches/:branchId/resource-blocks` - Create resource block
- ❌ `PATCH /api/admin/companies/:companyId/branches/:branchId/resource-blocks/:id` - Update resource block
- ❌ `DELETE /api/admin/companies/:companyId/branches/:branchId/resource-blocks/:id` - Delete resource block

#### Branch Contacts
- ❌ `GET /api/admin/companies/:companyId/branches/:branchId/contacts` - List contacts (branch-scoped)
- ❌ `POST /api/admin/companies/:companyId/branches/:branchId/contacts` - Create contact
- ❌ `PATCH /api/admin/companies/:companyId/branches/:branchId/contacts/:id` - Update contact
- ❌ `DELETE /api/admin/companies/:companyId/branches/:branchId/contacts/:id` - Delete contact

#### Branch Staff
- ❌ `GET /api/admin/companies/:companyId/branches/:branchId/staff` - List staff
- ❌ `POST /api/admin/companies/:companyId/branches/:branchId/staff` - Assign staff
- ❌ `DELETE /api/admin/companies/:companyId/branches/:branchId/staff/:id` - Remove staff

#### Courts (Branch-Scoped)
- ❌ `GET /api/admin/companies/:companyId/branches/:branchId/courts` - List courts (branch-scoped)
- ❌ `POST /api/admin/companies/:companyId/branches/:branchId/courts` - Create court
- ❌ `PATCH /api/admin/companies/:companyId/branches/:branchId/courts/:id` - Update court
- ❌ `DELETE /api/admin/companies/:companyId/branches/:branchId/courts/:id` - Delete court

#### Court Rate Rules
- ❌ `GET /api/admin/companies/:companyId/branches/:branchId/courts/:courtId/rate-rules` - List rate rules
- ❌ `POST /api/admin/companies/:companyId/branches/:branchId/courts/:courtId/rate-rules` - Create rate rule
- ❌ `PATCH /api/admin/companies/:companyId/branches/:branchId/courts/:courtId/rate-rules/:id` - Update rate rule
- ❌ `DELETE /api/admin/companies/:companyId/branches/:branchId/courts/:courtId/rate-rules/:id` - Delete rate rule

#### Branch Bookings
- ❌ `GET /api/admin/companies/:companyId/branches/:branchId/bookings` - List branch bookings
- ❌ `GET /api/admin/companies/:companyId/branches/:branchId/bookings/:bookingId` - Get booking
- ❌ `POST /api/admin/companies/:companyId/branches/:branchId/bookings/:bookingId/cancel` - Cancel booking
- ❌ `POST /api/admin/companies/:companyId/branches/:branchId/bookings/:bookingId/reschedule` - Reschedule booking

#### Branch Media
- 🟡 `POST /api/media/upload` - Upload media (exists but not branch-scoped)
- 🟡 `GET /api/media?owner_type=branch&owner_id=xxx` - List media (exists but not branch-scoped)

---

## C) ROUTE INVENTORY TABLE

| METHOD | PATH | Controller.method | Service.method | RBAC | Tenant | DB Tables |
|--------|------|-------------------|----------------|------|--------|-----------|
| GET | /health | inline | - | N | N | - |
| POST | /api/auth/signup | AuthController.signup | AuthService.signup | N | N | users, auth_identities |
| POST | /api/auth/login | AuthController.login | AuthService.login | N | N | users, auth_sessions |
| POST | /api/auth/otp/request | AuthController.requestOtp | AuthService.requestOtp | N | N | otp_codes |
| POST | /api/auth/otp/verify | AuthController.verifyOtp | AuthService.verifyOtp | N | N | otp_codes, users, auth_sessions |
| POST | /api/auth/refresh | AuthController.refresh | AuthService.refresh | N | N | auth_sessions |
| POST | /api/auth/logout | AuthController.logout | AuthService.logout | Y | N | auth_sessions |
| GET | /api/auth/me | AuthController.getMe | AuthService.getMe | Y | N | users |
| PATCH | /api/auth/me | AuthController.updateMe | AuthService.updateMe | Y | N | users |
| GET | /api/auth/me/sessions | inline | - | Y | N | auth_sessions |
| DELETE | /api/auth/me/sessions/:sessionId | inline | - | Y | N | auth_sessions |
| POST | /api/companies/:companyId/subscribe | inline | CompanyCustomerService.subscribe | Y | Y | company_customers |
| DELETE | /api/companies/:companyId/subscribe | inline | CompanyCustomerService.unsubscribe | Y | Y | company_customers |
| GET | /api/companies/me/companies | inline | CompanyCustomerService.getUserCompanies | Y | N | company_customers, companies |
| GET | /api/companies/:companyId/branches/:branchId/availability | inline | AvailabilityService.getBranchAvailability | N | Y | branches, branch_business_hours, branch_special_hours, resource_blocks, courts, booking_items, bookings |
| POST | /api/companies/:companyId/bookings | BookingController.create | BookingService.create | Y | Y | bookings, booking_items, booking_participants |
| GET | /api/companies/:companyId/bookings | BookingController.getAll | BookingService.findAll | Y | Y | bookings, booking_items |
| GET | /api/companies/:companyId/bookings/:bookingId | BookingController.getById | BookingService.findById | Y | Y | bookings, booking_items |
| POST | /api/companies/:companyId/bookings/:bookingId/cancel | BookingController.cancel | BookingService.cancel | Y | Y | bookings |
| POST | /api/companies/:companyId/memberships/purchase | inline | MembershipService.purchaseMembership | Y | Y | customer_memberships, membership_plans |
| GET | /api/companies/:companyId/memberships | inline | MembershipService.getUserMemberships | Y | Y | customer_memberships, membership_plans |
| POST | /api/companies/:companyId/memberships/:id/cancel | inline | MembershipService.cancelMembership | Y | Y | customer_memberships |
| POST | /api/companies/:companyId/payments/intent | inline | PaymentService.createPaymentIntent | Y | Y | payments |
| POST | /api/companies/:companyId/payments/confirm | inline | PaymentService.confirmPayment | Y | Y | payments |
| GET | /api/companies/:companyId/payments/:paymentId | inline | PaymentService.findById | Y | Y | payments |
| POST | /api/companies/:companyId/refunds | inline | RefundService.createRefund | Y | Y | refunds, payments, customer_wallet_ledger |
| GET | /api/companies/:companyId/invoices/:invoiceId | inline | InvoiceService.findById | Y | Y | invoices, invoice_items |
| POST | /api/companies/:companyId/promos/validate | inline | PromoCodeService.validatePromoCode | N | Y | promo_codes, campaigns, discount_applications |
| POST | /api/companies/:companyId/gift-cards/purchase | inline | GiftCardService.purchaseGiftCard | Y | Y | gift_cards, payments |
| POST | /api/companies/:companyId/gift-cards/redeem | inline | GiftCardService.redeemGiftCard | Y | Y | gift_cards, gift_card_redemptions, customer_wallet_ledger |
| GET | /api/companies/:companyId/gift-cards/me/gift-cards | inline | GiftCardService.findAll | Y | Y | gift_cards |
| GET | /api/companies/:companyId/gift-cards/:giftCardId | inline | GiftCardService.findById | Y | Y | gift_cards |
| GET | /api/companies/:companyId/reviews | BaseController.getAll | BaseService.paginate | N | Y | reviews |
| GET | /api/companies/:companyId/reviews/:id | BaseController.getById | BaseService.findById | N | Y | reviews |
| POST | /api/companies/:companyId/reviews | BaseController.create | BaseService.create | N | Y | reviews |
| PATCH | /api/companies/:companyId/reviews/:id | BaseController.update | BaseService.update | N | Y | reviews |
| DELETE | /api/companies/:companyId/reviews/:id | BaseController.delete | BaseService.delete | N | Y | reviews |
| POST | /api/companies/:companyId/support-tickets | inline | - | Y | Y | support_tickets, support_ticket_messages |
| GET | /api/companies/:companyId/support-tickets | inline | BaseService.findAll | Y | Y | support_tickets, support_ticket_messages |
| GET | /api/companies/:companyId/support-tickets/:ticketId | inline | BaseService.findById | Y | Y | support_tickets, support_ticket_messages |
| POST | /api/companies/:companyId/support-tickets/:ticketId/messages | inline | - | Y | Y | support_ticket_messages |
| GET | /api/me/wallet | inline | WalletService.getBalance | Y | N | customer_wallet_ledger |
| GET | /api/me/wallet/ledger | inline | WalletService.getLedger | Y | N | customer_wallet_ledger |
| POST | /api/media/upload | inline | MediaService.upload | Y | N | media_files, media_variants |
| GET | /api/media/:mediaId | inline | MediaService.findById | N | N | media_files |
| GET | /api/media | inline | MediaService.getByOwner | N | N | media_files |
| PATCH | /api/media/:mediaId | inline | MediaService.update | Y | N | media_files |
| DELETE | /api/media/:mediaId | inline | MediaService.delete | Y | N | media_files |
| GET | /api/admin/platform/companies | BaseController.getAll | BaseService.paginate | Y | N | companies |
| POST | /api/admin/platform/companies | BaseController.create | BaseService.create | Y | N | companies |
| GET | /api/admin/platform/companies/:id | BaseController.getById | BaseService.findById | Y | N | companies |
| PATCH | /api/admin/platform/companies/:id | BaseController.update | BaseService.update | Y | N | companies |
| DELETE | /api/admin/platform/companies/:id | BaseController.delete | BaseService.delete | Y | N | companies |
| GET | /api/admin/companies/:companyId/branches | BaseController.getAll | BaseService.paginate | Y | Y | branches |
| POST | /api/admin/companies/:companyId/branches | BaseController.create | BaseService.create | Y | Y | branches |
| GET | /api/admin/companies/:companyId/branches/:id | BaseController.getById | BaseService.findById | Y | Y | branches |
| PATCH | /api/admin/companies/:companyId/branches/:id | BaseController.update | BaseService.update | Y | Y | branches |
| DELETE | /api/admin/companies/:companyId/branches/:id | BaseController.delete | BaseService.delete | Y | Y | branches |
| GET | /api/admin/companies/:companyId/branches/:branchId/contacts | BaseController.getAll | BaseService.paginate | Y | Y | branch_contacts |
| POST | /api/admin/companies/:companyId/branches/:branchId/contacts | BaseController.create | BaseService.create | Y | Y | branch_contacts |
| GET | /api/admin/companies/:companyId/branches/:branchId/contacts/:id | BaseController.getById | BaseService.findById | Y | Y | branch_contacts |
| PATCH | /api/admin/companies/:companyId/branches/:branchId/contacts/:id | BaseController.update | BaseService.update | Y | Y | branch_contacts |
| DELETE | /api/admin/companies/:companyId/branches/:branchId/contacts/:id | BaseController.delete | BaseService.delete | Y | Y | branch_contacts |
| GET | /api/admin/companies/:companyId/branches/:branchId/courts | BaseController.getAll | BaseService.paginate | Y | Y | courts |
| POST | /api/admin/companies/:companyId/branches/:branchId/courts | BaseController.create | BaseService.create | Y | Y | courts |
| GET | /api/admin/companies/:companyId/branches/:branchId/courts/:id | BaseController.getById | BaseService.findById | Y | Y | courts |
| PATCH | /api/admin/companies/:companyId/branches/:branchId/courts/:id | BaseController.update | BaseService.update | Y | Y | courts |
| DELETE | /api/admin/companies/:companyId/branches/:branchId/courts/:id | BaseController.delete | BaseService.delete | Y | Y | courts |
| GET | /api/admin/companies/:companyId/services | BaseController.getAll | BaseService.paginate | Y | Y | services |
| POST | /api/admin/companies/:companyId/services | BaseController.create | BaseService.create | Y | Y | services |
| GET | /api/admin/companies/:companyId/services/:id | BaseController.getById | BaseService.findById | Y | Y | services |
| PATCH | /api/admin/companies/:companyId/services/:id | BaseController.update | BaseService.update | Y | Y | services |
| DELETE | /api/admin/companies/:companyId/services/:id | BaseController.delete | BaseService.delete | Y | Y | services |
| GET | /api/admin/companies/:companyId/membership-plans | BaseController.getAll | BaseService.paginate | Y | Y | membership_plans |
| POST | /api/admin/companies/:companyId/membership-plans | BaseController.create | BaseService.create | Y | Y | membership_plans |
| GET | /api/admin/companies/:companyId/membership-plans/:id | BaseController.getById | BaseService.findById | Y | Y | membership_plans |
| PATCH | /api/admin/companies/:companyId/membership-plans/:id | BaseController.update | BaseService.update | Y | Y | membership_plans |
| DELETE | /api/admin/companies/:companyId/membership-plans/:id | BaseController.delete | BaseService.delete | Y | Y | membership_plans |
| GET | /api/admin/companies/:companyId/membership-plans/:planId/benefits | BaseController.getAll | BaseService.paginate | Y | Y | membership_plan_benefits |
| POST | /api/admin/companies/:companyId/membership-plans/:planId/benefits | BaseController.create | BaseService.create | Y | Y | membership_plan_benefits |
| GET | /api/admin/companies/:companyId/membership-plans/:planId/benefits/:id | BaseController.getById | BaseService.findById | Y | Y | membership_plan_benefits |
| PATCH | /api/admin/companies/:companyId/membership-plans/:planId/benefits/:id | BaseController.update | BaseService.update | Y | Y | membership_plan_benefits |
| DELETE | /api/admin/companies/:companyId/membership-plans/:planId/benefits/:id | BaseController.delete | BaseService.delete | Y | Y | membership_plan_benefits |
| GET | /api/admin/companies/:companyId/campaigns | BaseController.getAll | BaseService.paginate | Y | Y | campaigns |
| POST | /api/admin/companies/:companyId/campaigns | BaseController.create | BaseService.create | Y | Y | campaigns |
| GET | /api/admin/companies/:companyId/campaigns/:id | BaseController.getById | BaseService.findById | Y | Y | campaigns |
| PATCH | /api/admin/companies/:companyId/campaigns/:id | BaseController.update | BaseService.update | Y | Y | campaigns |
| DELETE | /api/admin/companies/:companyId/campaigns/:id | BaseController.delete | BaseService.delete | Y | Y | campaigns |
| GET | /api/admin/companies/:companyId/promo-codes | BaseController.getAll | BaseService.paginate | Y | Y | promo_codes |
| POST | /api/admin/companies/:companyId/promo-codes | BaseController.create | BaseService.create | Y | Y | promo_codes |
| GET | /api/admin/companies/:companyId/promo-codes/:id | BaseController.getById | BaseService.findById | Y | Y | promo_codes |
| PATCH | /api/admin/companies/:companyId/promo-codes/:id | BaseController.update | BaseService.update | Y | Y | promo_codes |
| DELETE | /api/admin/companies/:companyId/promo-codes/:id | BaseController.delete | BaseService.delete | Y | Y | promo_codes |
| GET | /api/admin/companies/:companyId/notification-templates | BaseController.getAll | BaseService.paginate | Y | Y | notification_templates |
| POST | /api/admin/companies/:companyId/notification-templates | BaseController.create | BaseService.create | Y | Y | notification_templates |
| GET | /api/admin/companies/:companyId/notification-templates/:id | BaseController.getById | BaseService.findById | Y | Y | notification_templates |
| PATCH | /api/admin/companies/:companyId/notification-templates/:id | BaseController.update | BaseService.update | Y | Y | notification_templates |
| DELETE | /api/admin/companies/:companyId/notification-templates/:id | BaseController.delete | BaseService.delete | Y | Y | notification_templates |

---

## D) TOP 20 HIGH-RISK GAPS

### Critical Missing Endpoints (Blocking Console Usage)

1. **Branch Business Hours CRUD** ❌
   - **Impact:** Cannot set operating hours for branches
   - **Affects:** Company Admin, Branch Manager
   - **Table:** `branch_business_hours`

2. **Branch Special Hours CRUD** ❌
   - **Impact:** Cannot set holiday/special hours
   - **Affects:** Company Admin, Branch Manager
   - **Table:** `branch_special_hours`

3. **Resource Blocks CRUD** ❌
   - **Impact:** Cannot block courts for maintenance/events
   - **Affects:** Company Admin, Branch Manager
   - **Table:** `resource_blocks`

4. **Court Rate Rules CRUD** ❌
   - **Impact:** Cannot set dynamic pricing (peak/off-peak, member discounts)
   - **Affects:** Company Admin, Branch Manager
   - **Table:** `court_rate_rules`

5. **Branch Amenities CRUD** ❌
   - **Impact:** Cannot manage branch amenities
   - **Affects:** Company Admin
   - **Table:** `branch_amenities`

6. **Branch Staff Management** ❌
   - **Impact:** Cannot assign staff to branches
   - **Affects:** Company Admin, Branch Manager
   - **Table:** `branch_staff`

7. **Branch Manager Routes** ❌
   - **Impact:** No routes exist for `branch_manager` role
   - **Affects:** Branch Manager console completely non-functional
   - **Solution:** Need branch-scoped routes with `requireBranchManager` RBAC

8. **Company Profile Read/Update** ❌
   - **Impact:** Cannot view/edit company profile
   - **Affects:** Company Admin
   - **Table:** `companies`

9. **Admin Bookings List/Filter** ❌
   - **Impact:** Cannot view bookings across branches (admin view)
   - **Affects:** Company Admin, Branch Manager
   - **Table:** `bookings`, `booking_items`

10. **Admin Payments/Invoices/Refunds List** ❌
    - **Impact:** Cannot view financial data
    - **Affects:** Company Admin
    - **Tables:** `payments`, `invoices`, `refunds`

11. **Company Stats/Dashboard** ❌
    - **Impact:** No aggregated data for dashboards
    - **Affects:** Platform Admin, Company Admin
    - **Tables:** Multiple (aggregated queries needed)

12. **Company Suspension/Activation** ❌
    - **Impact:** Cannot suspend/activate companies
    - **Affects:** Platform Admin
    - **Table:** `companies` (status field)

13. **RBAC Management Endpoints** ❌
    - **Impact:** Cannot assign roles/permissions via API
    - **Affects:** Platform Admin
    - **Tables:** `user_roles`, `role_permissions`

14. **Audit Logs Read** ❌
    - **Impact:** Cannot view audit trail
    - **Affects:** Platform Admin
    - **Table:** `audit_logs`

15. **Branch Profile Update (Branch Manager)** ❌
    - **Impact:** Branch managers cannot update their branch
    - **Affects:** Branch Manager
    - **Table:** `branches`

16. **Booking Cancel/Reschedule (Admin)** ❌
    - **Impact:** Admins cannot manage bookings
    - **Affects:** Company Admin, Branch Manager
    - **Table:** `bookings`

17. **Branch-Scoped Court Management** ❌
    - **Impact:** Branch managers cannot manage courts in their branch
    - **Affects:** Branch Manager
    - **Table:** `courts`

18. **Branch-Scoped Media Management** ❌
    - **Impact:** Cannot manage branch/court media with proper scoping
    - **Affects:** Branch Manager
    - **Table:** `media_files`

19. **Tax Rates CRUD** ❌
    - **Impact:** Cannot manage tax rates
    - **Affects:** Company Admin
    - **Table:** `tax_rates`

20. **Service Branch Availability** ❌
    - **Impact:** Cannot set which branches offer which services
    - **Affects:** Company Admin
    - **Table:** `service_branch_availability`

---

## E) FIX PLAN

### Priority 1: Branch Management (Critical for Branch Console)

#### 1. Branch Business Hours CRUD
**Files to create/modify:**
- `backend/src/routes/branch-business-hours.js` (new)
- Add to `backend/src/routes/admin.js`:
  ```javascript
  companyAdminRouter.use('/branches/:branchId/business-hours', 
    CrudRouterFactory.create(new BaseService(BranchBusinessHours), {
      requireAuth: true,
      requireCompany: true,
      requireBranch: true,
      rbac: requireBranchManager // Allow branch managers too
    })
  );
  ```
- **Model:** `BranchBusinessHours` (exists)
- **Service:** Use `BaseService` (no custom logic needed)

#### 2. Branch Special Hours CRUD
**Files to create/modify:**
- `backend/src/routes/branch-special-hours.js` (new) OR add to admin.js
- Same pattern as business hours
- **Model:** `BranchSpecialHours` (exists)

#### 3. Resource Blocks CRUD
**Files to create/modify:**
- Add to `backend/src/routes/admin.js`
- **Model:** `ResourceBlock` (exists)
- **Service:** Use `BaseService`

#### 4. Branch Amenities CRUD
**Files to create/modify:**
- Add to `backend/src/routes/admin.js`
- **Model:** `BranchAmenity` (exists)

#### 5. Branch Staff CRUD
**Files to create/modify:**
- Add to `backend/src/routes/admin.js`
- **Model:** `BranchStaff` (exists)
- **Note:** May need custom service for user assignment logic

#### 6. Court Rate Rules CRUD
**Files to create/modify:**
- Add to `backend/src/routes/admin.js`:
  ```javascript
  companyAdminRouter.use('/branches/:branchId/courts/:courtId/rate-rules',
    CrudRouterFactory.create(new BaseService(CourtRateRule), {
      requireAuth: true,
      requireCompany: true,
      requireBranch: true,
      rbac: requireBranchManager
    })
  );
  ```
- **Model:** `CourtRateRule` (exists)

### Priority 2: Branch Manager Routes

#### 7. Create Branch Manager Router
**Files to create/modify:**
- `backend/src/routes/branch-manager.js` (new)
- Register in `backend/app.js`:
  ```javascript
  app.use('/api/admin/companies/:companyId/branches/:branchId', branchManagerRoutes);
  ```
- Apply middleware: `authenticate`, `validateCompany`, `validateBranch`, `requireBranchManager`
- Include all branch-scoped CRUD operations

### Priority 3: Company Admin Enhancements

#### 8. Company Profile Endpoint
**Files to create/modify:**
- Add to `backend/src/routes/admin.js`:
  ```javascript
  companyAdminRouter.get('/profile', async (req, res, next) => {
    // Get company with stats
  });
  companyAdminRouter.patch('/profile', async (req, res, next) => {
    // Update company
  });
  ```

#### 9. Admin Bookings List
**Files to create/modify:**
- `backend/src/routes/admin-bookings.js` (new)
- Register in `backend/app.js`
- **Service:** `BookingService` (extend with admin filters)
- **Controller:** New `AdminBookingController` or extend `BookingController`

#### 10. Admin Payments/Invoices/Refunds List
**Files to create/modify:**
- Add to `backend/src/routes/admin.js` or create separate routes
- Use `BaseService` with company_id filter

### Priority 4: Platform Admin Enhancements

#### 11. Company Status Management
**Files to create/modify:**
- Add to `backend/src/routes/admin.js`:
  ```javascript
  platformCompaniesRouter.patch('/:id/suspend', ...);
  platformCompaniesRouter.patch('/:id/activate', ...);
  ```

#### 12. Company Stats Endpoint
**Files to create/modify:**
- Add to `backend/src/routes/admin.js`:
  ```javascript
  platformCompaniesRouter.get('/:id/stats', async (req, res, next) => {
    // Aggregate: branch count, booking count, revenue, etc.
  });
  ```

#### 13. RBAC Management
**Files to create/modify:**
- `backend/src/routes/rbac.js` (new)
- Register in `backend/app.js` under `/api/admin/platform`
- **Services:** `RoleService`, `PermissionService`, `UserRoleService` (new)

#### 14. Audit Logs
**Files to create/modify:**
- `backend/src/routes/audit-logs.js` (new)
- Register in `backend/app.js` under `/api/admin/platform`
- **Service:** `AuditLogService` (new, extends `BaseService`)
- **Model:** `AuditLog` (exists)

### Priority 5: Additional Features

#### 15. Tax Rates CRUD
**Files to create/modify:**
- Add to `backend/src/routes/admin.js`
- **Model:** `TaxRate` (exists)

#### 16. Service Branch Availability
**Files to create/modify:**
- Add to `backend/src/routes/admin.js`
- **Model:** `ServiceBranchAvailability` (exists)

#### 17. Booking Reschedule
**Files to create/modify:**
- Add to `backend/src/routes/bookings.js` or `admin-bookings.js`
- **Service:** Extend `BookingService` with `reschedule()` method
- **Logic:** Check availability, update `booking_items`, create change log

---

## SUMMARY STATISTICS

- **Total Routes Implemented:** 67
- **Routes Missing (Critical):** 20+
- **Routes Missing (Nice-to-have):** 15+
- **Models Ready:** 60+ (all DBML tables have models)
- **Migrations:** 1 stub (needs full implementation)
- **Seeders:** 1 (roles, permissions, super admin - ✅ complete)

---

## RECOMMENDATIONS

1. **Immediate Priority:** Implement Branch Business Hours, Special Hours, Resource Blocks (blocks Branch Console)
2. **High Priority:** Create Branch Manager routes with proper RBAC
3. **Medium Priority:** Add admin booking/payment views
4. **Low Priority:** Audit logs, RBAC management, stats endpoints

**Estimated Development Time:**
- Priority 1: 2-3 days
- Priority 2: 1-2 days
- Priority 3: 2-3 days
- Priority 4: 1-2 days
- **Total:** 6-10 days for full console readiness




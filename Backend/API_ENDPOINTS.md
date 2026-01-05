# API Endpoints Summary

## Authentication & User Management

### Auth
- `POST /api/auth/signup` - User signup
- `POST /api/auth/login` - User login (email/phone + password)
- `POST /api/auth/otp/request` - Request OTP code
- `POST /api/auth/otp/verify` - Verify OTP and login/signup
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - Logout (revoke session)
- `GET /api/auth/me` - Get current user profile
- `PATCH /api/auth/me` - Update current user profile

### Sessions
- `GET /api/auth/me/sessions` - List user sessions
- `DELETE /api/auth/me/sessions/:sessionId` - Revoke specific session

## Company Subscriptions

- `POST /api/companies/:companyId/subscribe` - Subscribe to company
- `DELETE /api/companies/:companyId/subscribe` - Unsubscribe from company
- `GET /api/companies/me/companies` - Get user's subscribed companies

## Availability & Courts

- `GET /api/companies/:companyId/branches/:branchId/availability` - Get branch availability (business hours, special hours, blocks, bookings)

## Bookings

- `POST /api/companies/:companyId/bookings` - Create booking (with overlap prevention)
- `GET /api/companies/:companyId/bookings` - List user's bookings
- `GET /api/companies/:companyId/bookings/:bookingId` - Get booking details
- `POST /api/companies/:companyId/bookings/:bookingId/cancel` - Cancel booking

## Memberships

- `POST /api/companies/:companyId/memberships/purchase` - Purchase membership
- `GET /api/companies/:companyId/memberships/me/memberships` - Get user's memberships
- `POST /api/companies/:companyId/memberships/:id/cancel` - Cancel membership

## Payments

- `POST /api/companies/:companyId/payments/intent` - Create payment intent
- `POST /api/companies/:companyId/payments/confirm` - Confirm payment (mock)
- `GET /api/companies/:companyId/payments/:paymentId` - Get payment details

## Refunds

- `POST /api/companies/:companyId/payments/refunds` - Create refund (admin only)

## Invoices

- `GET /api/companies/:companyId/invoices/:invoiceId` - Get invoice with items

## Promo Codes

- `POST /api/companies/:companyId/promos/validate` - Validate promo code

## Gift Cards

- `POST /api/companies/:companyId/gift-cards/purchase` - Purchase gift card
- `POST /api/companies/:companyId/gift-cards/redeem` - Redeem gift card
- `GET /api/companies/:companyId/gift-cards/me/gift-cards` - Get user's gift cards
- `GET /api/companies/:companyId/gift-cards/:giftCardId` - Get gift card details

## Wallet

- `GET /api/me/wallet?company_id=xxx` - Get wallet balance
- `GET /api/me/wallet/ledger?company_id=xxx` - Get wallet transaction ledger

## Media

- `POST /api/media/upload` - Upload media file (multipart/form-data)
- `GET /api/media/:mediaId` - Get/download media file
- `GET /api/media?owner_type=xxx&owner_id=xxx` - List media by owner
- `PATCH /api/media/:mediaId` - Update media metadata
- `DELETE /api/media/:mediaId` - Delete media

## Reviews

- `GET /api/companies/:companyId/reviews` - List reviews
- `GET /api/companies/:companyId/reviews/:id` - Get review
- `POST /api/companies/:companyId/reviews` - Create review
- `PATCH /api/companies/:companyId/reviews/:id` - Update review
- `DELETE /api/companies/:companyId/reviews/:id` - Delete review

## Support Tickets

- `POST /api/companies/:companyId/support-tickets` - Create support ticket
- `GET /api/companies/:companyId/support-tickets` - List user's tickets
- `GET /api/companies/:companyId/support-tickets/:ticketId` - Get ticket with messages
- `POST /api/companies/:companyId/support-tickets/:ticketId/messages` - Add message to ticket

## Admin Endpoints (Company Admin)

### Companies (Platform Admin Only)
- `GET /api/admin/platform/companies` - List all companies
- `POST /api/admin/platform/companies` - Create company
- `GET /api/admin/platform/companies/:id` - Get company
- `PATCH /api/admin/platform/companies/:id` - Update company
- `DELETE /api/admin/platform/companies/:id` - Delete company

### Branches
- `GET /api/admin/companies/:companyId/branches` - List branches
- `POST /api/admin/companies/:companyId/branches` - Create branch
- `GET /api/admin/companies/:companyId/branches/:id` - Get branch
- `PATCH /api/admin/companies/:companyId/branches/:id` - Update branch
- `DELETE /api/admin/companies/:companyId/branches/:id` - Delete branch

### Branch Contacts
- `GET /api/admin/companies/:companyId/branches/:branchId/contacts` - List contacts
- `POST /api/admin/companies/:companyId/branches/:branchId/contacts` - Create contact
- `GET /api/admin/companies/:companyId/branches/:branchId/contacts/:id` - Get contact
- `PATCH /api/admin/companies/:companyId/branches/:branchId/contacts/:id` - Update contact
- `DELETE /api/admin/companies/:companyId/branches/:branchId/contacts/:id` - Delete contact

### Courts
- `GET /api/admin/companies/:companyId/branches/:branchId/courts` - List courts
- `POST /api/admin/companies/:companyId/branches/:branchId/courts` - Create court
- `GET /api/admin/companies/:companyId/branches/:branchId/courts/:id` - Get court
- `PATCH /api/admin/companies/:companyId/branches/:branchId/courts/:id` - Update court
- `DELETE /api/admin/companies/:companyId/branches/:branchId/courts/:id` - Delete court

### Services
- `GET /api/admin/companies/:companyId/services` - List services
- `POST /api/admin/companies/:companyId/services` - Create service
- `GET /api/admin/companies/:companyId/services/:id` - Get service
- `PATCH /api/admin/companies/:companyId/services/:id` - Update service
- `DELETE /api/admin/companies/:companyId/services/:id` - Delete service

### Membership Plans
- `GET /api/admin/companies/:companyId/membership-plans` - List plans
- `POST /api/admin/companies/:companyId/membership-plans` - Create plan
- `GET /api/admin/companies/:companyId/membership-plans/:id` - Get plan
- `PATCH /api/admin/companies/:companyId/membership-plans/:id` - Update plan
- `DELETE /api/admin/companies/:companyId/membership-plans/:id` - Delete plan

### Membership Plan Benefits
- `GET /api/admin/companies/:companyId/membership-plans/:planId/benefits` - List benefits
- `POST /api/admin/companies/:companyId/membership-plans/:planId/benefits` - Create benefit
- `GET /api/admin/companies/:companyId/membership-plans/:planId/benefits/:id` - Get benefit
- `PATCH /api/admin/companies/:companyId/membership-plans/:planId/benefits/:id` - Update benefit
- `DELETE /api/admin/companies/:companyId/membership-plans/:planId/benefits/:id` - Delete benefit

### Campaigns
- `GET /api/admin/companies/:companyId/campaigns` - List campaigns
- `POST /api/admin/companies/:companyId/campaigns` - Create campaign
- `GET /api/admin/companies/:companyId/campaigns/:id` - Get campaign
- `PATCH /api/admin/companies/:companyId/campaigns/:id` - Update campaign
- `DELETE /api/admin/companies/:companyId/campaigns/:id` - Delete campaign

### Promo Codes
- `GET /api/admin/companies/:companyId/promo-codes` - List promo codes
- `POST /api/admin/companies/:companyId/promo-codes` - Create promo code
- `GET /api/admin/companies/:companyId/promo-codes/:id` - Get promo code
- `PATCH /api/admin/companies/:companyId/promo-codes/:id` - Update promo code
- `DELETE /api/admin/companies/:companyId/promo-codes/:id` - Delete promo code

### Notification Templates
- `GET /api/admin/companies/:companyId/notification-templates` - List templates
- `POST /api/admin/companies/:companyId/notification-templates` - Create template
- `GET /api/admin/companies/:companyId/notification-templates/:id` - Get template
- `PATCH /api/admin/companies/:companyId/notification-templates/:id` - Update template
- `DELETE /api/admin/companies/:companyId/notification-templates/:id` - Delete template

## Notes

- All endpoints require authentication unless marked as optional
- Company-scoped endpoints require company subscription (except admin endpoints)
- Admin endpoints require appropriate RBAC roles
- All timestamps are in UTC
- Pagination: `?page=1&pageSize=10`
- Filtering and sorting can be added via query parameters




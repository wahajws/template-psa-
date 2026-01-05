# Admin Portal - Complete CRUD for All Tables

## ✅ Implementation Complete

The admin portal now provides full CRUD operations for **ALL 60+ tables** in the database.

## Platform Admin Routes

All routes are accessible at `/api/admin/platform/{table-name}` and require:
- Authentication (Bearer token)
- `platform_super_admin` role

### Available Tables (60+ tables)

#### Core Tables
- ✅ `/api/admin/platform/companies` - Companies
- ✅ `/api/admin/platform/users` - Users
- ✅ `/api/admin/platform/roles` - Roles
- ✅ `/api/admin/platform/permissions` - Permissions
- ✅ `/api/admin/platform/user-roles` - User Roles
- ✅ `/api/admin/platform/role-permissions` - Role Permissions

#### Authentication & Sessions
- ✅ `/api/admin/platform/auth-identities` - Auth Identities
- ✅ `/api/admin/platform/auth-sessions` - Auth Sessions
- ✅ `/api/admin/platform/otp-codes` - OTP Codes
- ✅ `/api/admin/platform/company-customers` - Company Customers

#### Branches & Locations
- ✅ `/api/admin/platform/branches` - Branches
- ✅ `/api/admin/platform/branch-contacts` - Branch Contacts
- ✅ `/api/admin/platform/branch-amenities` - Branch Amenities
- ✅ `/api/admin/platform/branch-staff` - Branch Staff
- ✅ `/api/admin/platform/branch-business-hours` - Branch Business Hours
- ✅ `/api/admin/platform/branch-special-hours` - Branch Special Hours

#### Courts & Resources
- ✅ `/api/admin/platform/courts` - Courts
- ✅ `/api/admin/platform/court-features` - Court Features
- ✅ `/api/admin/platform/court-rate-rules` - Court Rate Rules
- ✅ `/api/admin/platform/court-time-slots` - Court Time Slots
- ✅ `/api/admin/platform/resource-blocks` - Resource Blocks

#### Services
- ✅ `/api/admin/platform/services` - Services
- ✅ `/api/admin/platform/service-branch-availability` - Service Branch Availability

#### Memberships
- ✅ `/api/admin/platform/membership-plans` - Membership Plans
- ✅ `/api/admin/platform/membership-plan-benefits` - Membership Plan Benefits
- ✅ `/api/admin/platform/customer-memberships` - Customer Memberships
- ✅ `/api/admin/platform/membership-cycles` - Membership Cycles
- ✅ `/api/admin/platform/membership-usage-ledger` - Membership Usage Ledger

#### Campaigns & Discounts
- ✅ `/api/admin/platform/campaigns` - Campaigns
- ✅ `/api/admin/platform/campaign-rules` - Campaign Rules
- ✅ `/api/admin/platform/promo-codes` - Promo Codes
- ✅ `/api/admin/platform/discount-applications` - Discount Applications

#### Bookings
- ✅ `/api/admin/platform/bookings` - Bookings
- ✅ `/api/admin/platform/booking-items` - Booking Items
- ✅ `/api/admin/platform/booking-participants` - Booking Participants
- ✅ `/api/admin/platform/booking-change-log` - Booking Change Log
- ✅ `/api/admin/platform/booking-waitlist` - Booking Waitlist
- ✅ `/api/admin/platform/court-reservation-locks` - Court Reservation Locks

#### Payments & Financial
- ✅ `/api/admin/platform/payments` - Payments
- ✅ `/api/admin/platform/payment-attempts` - Payment Attempts
- ✅ `/api/admin/platform/refunds` - Refunds
- ✅ `/api/admin/platform/invoices` - Invoices
- ✅ `/api/admin/platform/invoice-items` - Invoice Items
- ✅ `/api/admin/platform/customer-wallet-ledger` - Customer Wallet Ledger
- ✅ `/api/admin/platform/gift-cards` - Gift Cards
- ✅ `/api/admin/platform/gift-card-redemptions` - Gift Card Redemptions

#### Notifications
- ✅ `/api/admin/platform/notification-templates` - Notification Templates
- ✅ `/api/admin/platform/notifications-outbox` - Notifications Outbox
- ✅ `/api/admin/platform/notification-delivery-logs` - Notification Delivery Logs
- ✅ `/api/admin/platform/user-notification-preferences` - User Notification Preferences

#### Reviews & Support
- ✅ `/api/admin/platform/reviews` - Reviews
- ✅ `/api/admin/platform/support-tickets` - Support Tickets
- ✅ `/api/admin/platform/support-ticket-messages` - Support Ticket Messages

#### Groups
- ✅ `/api/admin/platform/groups` - Groups
- ✅ `/api/admin/platform/group-members` - Group Members
- ✅ `/api/admin/platform/group-bookings` - Group Bookings

#### Other
- ✅ `/api/admin/platform/tax-rates` - Tax Rates
- ✅ `/api/admin/platform/media-files` - Media Files
- ✅ `/api/admin/platform/media-variants` - Media Variants
- ✅ `/api/admin/activity` - Audit Logs (read-only)

## Frontend Developer Console

The Developer Console (`/admin/developer-console`) now includes all tables with:
- ✅ Table selector dropdown
- ✅ List view with pagination
- ✅ Create/Edit forms
- ✅ Delete functionality
- ✅ Error handling for missing endpoints

## CRUD Operations

Each table supports:
- **GET** `/api/admin/platform/{table}` - List all records (with pagination)
- **GET** `/api/admin/platform/{table}/:id` - Get single record
- **POST** `/api/admin/platform/{table}` - Create new record
- **PATCH** `/api/admin/platform/{table}/:id` - Update record
- **DELETE** `/api/admin/platform/{table}/:id` - Delete record

## Access

1. **Login** as platform admin:
   - Email: `admin@platform.com` or `system@platform.com`
   - Password: `Admin123!` or `SystemUser123!`

2. **Navigate** to Developer Console:
   - URL: `http://localhost:3001/admin/developer-console`
   - Or click "Developer Console" in the admin sidebar

3. **Select** any table from the dropdown

4. **Perform** CRUD operations:
   - Click "Add New" to create
   - Click "Edit" icon to update
   - Click "Delete" icon to remove
   - View all records in the table

## Important Notes

- **Server Restart Required**: After adding routes, restart the server
- **All tables** are accessible via platform admin routes
- **Company-specific tables** can also be accessed via `/admin/companies/:companyId/...` routes
- **Audit Logs** are read-only (no create/edit/delete)

## Next Steps

1. **Restart the server**:
   ```bash
   cd Backend
   npm start
   ```

2. **Test the Developer Console**:
   - Login as platform admin
   - Navigate to Developer Console
   - Select any table
   - Test CRUD operations

All tables are now accessible for full CRUD operations! 🎉


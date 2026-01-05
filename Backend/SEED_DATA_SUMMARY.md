# Seed Data Summary

This document lists all tables that have mock data in the seed scripts.

## Seed Scripts

1. **`seed.js`** - Basic seed with essential data
2. **`seed-comprehensive.js`** - Full seed with data for all tables

## Tables with Seed Data

### ✅ Authentication & Users
- ✅ `users` - 8 users (1 platform admin, 1 company admin, 1 branch manager, 1 branch staff, 5 customers)
- ✅ `roles` - 5 roles (platform_super_admin, company_admin, branch_manager, branch_staff, customer)
- ✅ `permissions` - 12 permissions (CRUD for company, branch, booking)
- ✅ `role_permissions` - Permissions assigned to platform admin role
- ✅ `user_roles` - User role assignments
- ✅ `auth_identities` - Email/password auth for all users
- ✅ `auth_sessions` - Sample active session
- ✅ `otp_codes` - Sample OTP code

### ✅ Companies & Branches
- ✅ `companies` - 2 companies (Pickleball Paradise, Court Masters)
- ✅ `branches` - 2 branches (Downtown, Westside)
- ✅ `branch_contacts` - Phone and email contacts for branches
- ✅ `branch_amenities` - 5 amenities (Parking, Locker Room, Pro Shop, Cafe, WiFi)
- ✅ `branch_staff` - Branch staff assignments
- ✅ `branch_business_hours` - Business hours for all days (0-6)
- ✅ `branch_special_hours` - Holiday/special hours
- ✅ `company_customers` - 3 customer subscriptions

### ✅ Courts & Resources
- ✅ `courts` - 6 courts with varying rates
- ✅ `court_features` - Features for each court (Lighting, Net, Scoreboard)
- ✅ `court_rate_rules` - Peak hours and weekend rate rules
- ✅ `court_time_slots` - Booked time slots
- ✅ `resource_blocks` - Maintenance blocks

### ✅ Bookings
- ✅ `bookings` - Sample confirmed booking
- ✅ `booking_items` - Booking items with court and service
- ✅ `booking_participants` - Additional players in booking
- ✅ `booking_change_log` - Booking change history
- ✅ `booking_waitlist` - Waitlist entries
- ✅ `court_reservation_locks` - (via court_time_slots)

### ✅ Groups
- ✅ `groups` - 1 group (Weekend Players)
- ✅ `group_members` - 3 members in group
- ✅ `group_bookings` - (can be created via API)

### ✅ Services & Memberships
- ✅ `services` - 2 services (Court Rental, Equipment Rental)
- ✅ `service_branch_availability` - Service availability per branch
- ✅ `membership_plans` - 2 plans (Monthly Unlimited, 10-Session Pass)
- ✅ `membership_plan_benefits` - Benefits for membership plans
- ✅ `customer_memberships` - Active customer membership
- ✅ `membership_cycles` - Membership billing cycles
- ✅ `membership_usage_ledger` - Membership usage tracking

### ✅ Marketing
- ✅ `campaigns` - 1 campaign (Summer Special)
- ✅ `campaign_rules` - Campaign rules (minimum amount)
- ✅ `promo_codes` - 1 promo code (SUMMER2024 - 15% off)
- ✅ `discount_applications` - Applied discounts

### ✅ Financial
- ✅ `payments` - Completed payment
- ✅ `payment_attempts` - Failed payment attempt
- ✅ `refunds` - Sample refund
- ✅ `invoices` - Paid invoice
- ✅ `invoice_items` - Invoice line items
- ✅ `customer_wallet_ledger` - Wallet transactions
- ✅ `tax_rates` - Sales tax rate (8.5%)

### ✅ Gift Cards
- ✅ `gift_cards` - Active gift card with balance
- ✅ `gift_card_redemptions` - Gift card redemption record

### ✅ Notifications
- ✅ `notification_templates` - Email template (booking_confirmation)
- ✅ `notifications_outbox` - Sent notification
- ✅ `notification_delivery_logs` - Delivery status
- ✅ `user_notification_preferences` - User preferences

### ✅ Reviews & Support
- ✅ `reviews` - 3 reviews with ratings
- ✅ `support_tickets` - 1 support ticket
- ✅ `support_ticket_messages` - 2 messages (customer + admin)

### ✅ Audit & Media
- ✅ `audit_logs` - Sample audit log entry
- ⚠️ `media_files` - (Can be created via API upload)
- ⚠️ `media_variants` - (Created with media files)

## Usage

### Basic Seed (Essential Data)
```bash
npm run seed
```

### Comprehensive Seed (All Tables)
```bash
npm run seed:full
```

## Test Credentials

After seeding, you can use these credentials:

- **Platform Admin**: `admin@platform.com` / `Admin123!`
- **Company Admin**: `company@admin.com` / `Company123!`
- **Branch Manager**: `branch@manager.com` / `Branch123!`
- **Branch Staff**: `staff@branch.com` / `Staff123!`
- **Customers**: `customer1@test.com` through `customer5@test.com` / `Customer123!`

## Test Data Highlights

- **Companies**: 2 companies
- **Branches**: 2 branches with full setup
- **Courts**: 6 courts with features and rate rules
- **Services**: 2 services
- **Membership Plans**: 2 plans with benefits
- **Bookings**: Sample booking with participants
- **Payments**: Completed payment with invoice
- **Promo Code**: `SUMMER2024` (15% discount)
- **Gift Card**: Active gift card with $50 balance
- **Reviews**: 3 reviews
- **Support Ticket**: 1 ticket with messages

## Notes

- All timestamps are set to realistic future dates for bookings
- Phone numbers follow format: `+1234567890X`
- All passwords are hashed using bcrypt
- OTP codes use mock value: `123456`
- Some tables (like `media_files`) are better created via API uploads



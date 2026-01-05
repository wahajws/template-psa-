# User Activity Tracking Implementation

## Overview
This document describes the implementation of user activity tracking for the Platform Admin Console. The system collects, stores, and displays user activity events across the platform.

## Architecture

### Backend Components

#### 1. Activity Logger Utility (`backend/src/utils/activityLogger.js`)
- **Purpose**: Central utility for logging activity events
- **Key Features**:
  - Sanitizes metadata to remove sensitive data (passwords, tokens, OTPs)
  - Normalizes actions to match database enum or uses string
  - Handles nullable actor_user_id and entity_id (uses system user ID for anonymous)
  - Supports transaction context for atomic operations

#### 2. Activity Middleware (`backend/src/middlewares/activity.js`)
- **`activityContext`**: Enriches requests with activity context (IP, user agent, actor, company, branch)
- **`logActivity`**: Helper function to log activities from controllers/services
- Applied globally in `app.js` to all requests

#### 3. Activity Service (`backend/src/services/ActivityService.js`)
- **`getActivities`**: Query activities with filters (date range, company, branch, actor, action, entity type, search)
- **`exportActivities`**: Export filtered activities to CSV
- Handles JSON metadata queries for company/branch filtering

#### 4. Activity Controller (`backend/src/controllers/ActivityController.js`)
- **`GET /admin/activity`**: Get paginated activities with filters
- **`GET /admin/activity/export`**: Export activities to CSV
- Requires `platform_super_admin` role

#### 5. Activity Routes (`backend/src/routes/activity.js`)
- Mounted at `/api/admin/activity`
- Protected by authentication and platform admin RBAC

### Frontend Components

#### 1. Activity Page (`frontend/src/pages/admin/ActivityPage.js`)
- **Features**:
  - Table view with pagination
  - Advanced filters (date range, company, branch, actor, action, entity type, search)
  - Detail drawer showing full activity metadata
  - CSV export functionality
  - Loading states and error handling

#### 2. Admin Layout Update
- Added "User Activity" menu item in sidebar
- Route: `/admin/activity`

## Activity Events Tracked

### Authentication
- `signup` - User registration
- `login` - User login
- `logout` - User logout
- `refresh` - Token refresh
- `otp_request` - OTP code request
- `otp_verify` - OTP code verification

### Bookings
- `booking_created` - New booking created
- `booking_cancelled` - Booking cancelled
- `booking_rescheduled` - Booking rescheduled (TODO: add when implemented)

### Memberships
- `membership_purchased` - Membership purchased
- `membership_cancelled` - Membership cancelled

### Payments
- `payment_intent_created` - Payment intent created
- `payment_confirmed` - Payment confirmed
- `refund_created` - Refund created

### Promo Codes
- `promo_validated` - Promo code validated

### Gift Cards
- `gift_card_purchased` - Gift card purchased
- `gift_card_redeemed` - Gift card redeemed

### Media
- `media_uploaded` - Media file uploaded
- `media_deleted` - Media file deleted

### Admin Actions
- `company_created` - Company created (via BaseController)
- `company_updated` - Company updated (via BaseController)
- `company_suspended` - Company suspended (via BaseController)

## Data Model

Uses existing `audit_logs` table:
- `actor_user_id` - User who performed the action (system user for anonymous)
- `action` - Action type (string, normalized from enum when possible)
- `entity_type` - Type of entity (auth, booking, membership, etc.)
- `entity_id` - ID of the entity (placeholder for null)
- `before_snapshot` - JSON snapshot before change
- `after_snapshot` - JSON snapshot after change
- `ip_address` - IP address of request
- `user_agent` - User agent string
- `metadata` - Additional context (company_id, branch_id, path, method, request_id, etc.)
- `created_at` - Timestamp

## Security & Privacy

1. **Sensitive Data Sanitization**: Passwords, OTPs, tokens are redacted in metadata
2. **RBAC**: Only `platform_super_admin` can view activities
3. **IP & User Agent**: Captured for security auditing
4. **Metadata**: Stores safe context only (no sensitive payloads)

## API Endpoints

### GET `/api/admin/activity`
Query parameters:
- `page` (default: 1)
- `pageSize` (default: 25)
- `from` - Date from (YYYY-MM-DD)
- `to` - Date to (YYYY-MM-DD)
- `company_id` - Filter by company
- `branch_id` - Filter by branch
- `actor_user_id` - Filter by actor
- `action` - Filter by action (can be array)
- `entity_type` - Filter by entity type (can be array)
- `search` - Search in entity_id or actor email

Response:
```json
{
  "success": true,
  "data": {
    "items": [...],
    "total": 100,
    "page": 1,
    "pageSize": 25,
    "totalPages": 4
  }
}
```

### GET `/api/admin/activity/export`
Same query parameters as above. Returns CSV file download.

## Files Modified/Created

### Backend
- `backend/src/utils/activityLogger.js` (NEW)
- `backend/src/middlewares/activity.js` (NEW)
- `backend/src/services/ActivityService.js` (NEW)
- `backend/src/controllers/ActivityController.js` (NEW)
- `backend/src/routes/activity.js` (NEW)
- `backend/src/models/AuditLog.js` (UPDATED - action field changed to string)
- `backend/src/models/index.js` (UPDATED - added AuditLog association)
- `backend/app.js` (UPDATED - added activityContext middleware)
- `backend/src/routes/admin.js` (UPDATED - added activity routes)
- `backend/src/controllers/AuthController.js` (UPDATED - added logging)
- `backend/src/controllers/BookingController.js` (UPDATED - added logging)
- `backend/src/controllers/BaseController.js` (UPDATED - added logging for company operations)
- `backend/src/routes/memberships.js` (UPDATED - added logging)
- `backend/src/routes/payments.js` (UPDATED - added logging)
- `backend/src/routes/media.js` (UPDATED - added logging)
- `backend/src/routes/gift-cards.js` (UPDATED - added logging)
- `backend/src/routes/promo-codes.js` (UPDATED - added logging)
- `backend/src/routes/refunds.js` (UPDATED - added logging)
- `backend/scripts/seed.js` (UPDATED - added system user)

### Frontend
- `frontend/src/pages/admin/ActivityPage.js` (NEW)
- `frontend/src/components/layouts/AdminLayout.js` (UPDATED - added menu item)
- `frontend/src/config/api.js` (UPDATED - added activity endpoints)
- `frontend/src/utils/constants.js` (UPDATED - added activity route)
- `frontend/src/App.js` (UPDATED - added activity route)

## Usage

### Viewing Activities
1. Login as Platform Admin
2. Navigate to "User Activity" in sidebar
3. Use filters to narrow down activities
4. Click "View" to see detailed metadata

### Exporting Activities
1. Apply desired filters
2. Click "Export CSV" button
3. CSV file downloads with current filtered view

## Notes

1. **System User**: A system user (ID: `00000000-0000-0000-0000-000000000000`) is created during seeding for anonymous activity logging
2. **Action Normalization**: Actions are normalized to match enum values when possible, but new actions can be strings
3. **Metadata Filtering**: Company/branch filtering from metadata is done post-query due to JSON query complexity
4. **Performance**: Consider adding indexes on `metadata` JSON field if query performance becomes an issue
5. **Rate Limiting**: High-volume events (like search) could be sampled in the future

## Future Enhancements

1. Real-time activity feed (WebSocket)
2. Activity alerts/notifications
3. Activity analytics dashboard
4. Visibility controls for company/branch consoles
5. Activity retention policies



# Product Analytics Telemetry Implementation

## Overview
This document describes the implementation of product analytics telemetry for user behavior tracking. The system collects behavior events, stores them in the `audit_logs` table (using `entity_type='telemetry'`), and provides a Platform Admin UI to view, filter, and export behavior logs.

## Architecture

### Backend Components

#### 1. Telemetry Utility (`backend/src/utils/telemetry.js`)
- **Purpose**: Central utility for tracking behavior events
- **Key Features**:
  - Validates event names against allow-list
  - Sanitizes sensitive data (passwords, tokens, codes)
  - Masks promo/gift card codes (e.g., `ABC***XYZ`)
  - Rounds geo coordinates to 2 decimals
  - Derives device type from user agent
  - Enriches events with request context (IP, user agent, path, referrer, session)

#### 2. Telemetry Controller (`backend/src/controllers/TelemetryController.js`)
- **`POST /telemetry`**: Accepts behavior events from frontend
  - Optional authentication (anonymous allowed)
  - Rate-limited (100 req/15min for anonymous, 1000 req/15min for authenticated)
  - Validates event_name against allow-list
  - Returns 204 No Content

#### 3. Behaviour Service (`backend/src/services/BehaviourService.js`)
- **`getBehaviourEvents`**: Query behavior events with filters
- **`exportBehaviourEvents`**: Export to CSV
- Filters by `entity_type='telemetry'` to separate from audit logs

#### 4. Behaviour Controller (`backend/src/controllers/BehaviourController.js`)
- **`GET /admin/behaviour`**: Get paginated behavior events
- **`GET /admin/behaviour/export`**: Export to CSV
- Requires `platform_super_admin` role

#### 5. Routes
- `/api/telemetry` - Public endpoint for submitting events
- `/api/admin/behaviour` - Admin endpoint for viewing events

### Frontend Components

#### 1. Telemetry Client (`frontend/src/api/telemetryClient.js`)
- **`sendEvent(eventName, payload, debounce)`**: Send behavior event
- **`trackPageView(path, referrer)`**: Track page views
- **Features**:
  - Debouncing for high-volume events (search)
  - Silent failure (doesn't break app)
  - Session ID support via `x-session-id` header

#### 2. Behaviour Page (`frontend/src/pages/admin/BehaviourPage.js`)
- **Features**:
  - Table view with pagination
  - Filters: date range (defaults to last 7 days), company, branch, user, event name (multi-select), device type, search
  - Detail drawer with JSON viewer
  - CSV export
  - Loading states and error handling

#### 3. Admin Layout Update
- Added "Behaviour Logs" menu item in sidebar
- Route: `/admin/behaviour`

## Event Types Tracked

### Auth & Onboarding
- `auth.signup`
- `auth.login`
- `auth.logout`
- `auth.otp_request`
- `auth.otp_verify`
- `profile.updated`

### Discovery / Search
- `explore.search` (debounced, includes query length, filters, rounded lat/lng, radius)
- `branch.view`
- `court.view`
- `gallery.view`

### Booking Funnel
- `booking.start`
- `booking.slot_view`
- `booking.quote_view`
- `booking.promo_applied` (code masked)
- `booking.giftcard_applied` (code masked)
- `booking.confirmed` (server-side)
- `booking.cancelled` (server-side)
- `booking.rescheduled`
- `booking.failed`

### Membership Funnel
- `membership.list_view`
- `membership.plan_view`
- `membership.purchase_started`
- `membership.purchase_completed` (server-side)
- `membership.cancelled`

### Payments
- `payment.intent_created`
- `payment.confirmed` (server-side)
- `payment.failed`
- `refund.created`

### Engagement
- `notification.opened`
- `support.ticket_created`

### Media
- `media.uploaded`
- `media.deleted`

## Data Model

Uses existing `audit_logs` table:
- `actor_user_id` - User who performed the action (system user for anonymous)
- `action` - Event name (e.g., 'auth.login', 'booking.confirmed')
- `entity_type` - Always 'telemetry' for behavior events
- `entity_id` - Entity ID if relevant (placeholder for null)
- `metadata` - JSON containing:
  - `event_name` - Event name
  - `event_time` - UTC ISO timestamp
  - `session_id` - Session identifier
  - `request_id` - Request identifier
  - `page_path` - Page path
  - `referrer` - Referrer URL
  - `device_type` - mobile/tablet/desktop/unknown
  - `user_agent` - Raw user agent
  - `ip_address` - IP address
  - `company_id` - Company ID (if applicable)
  - `branch_id` - Branch ID (if applicable)
  - `properties` - Event-specific properties (sanitized)

## Privacy & Security

1. **Sensitive Data Sanitization**:
   - Passwords, tokens, OTPs removed
   - Promo/gift codes masked (e.g., `ABC***XYZ`)
   - Geo coordinates rounded to 2 decimals

2. **Rate Limiting**:
   - Anonymous: 100 requests per 15 minutes
   - Authenticated: 1000 requests per 15 minutes

3. **Event Validation**:
   - Event names validated against allow-list
   - Prevents junk/invalid events

4. **RBAC**:
   - Only `platform_super_admin` can view behavior logs

## Server-Side Tracking

Critical events are tracked server-side (don't rely only on frontend):
- `booking.confirmed` - In BookingController
- `booking.cancelled` - In BookingController
- `membership.purchase_completed` - In memberships route
- `payment.confirmed` - In payments route
- `booking.giftcard_applied` - In gift-cards route

## Frontend Tracking Examples

### Page View
```javascript
TelemetryClient.trackPageView(window.location.pathname);
```

### Search Event (Debounced)
```javascript
TelemetryClient.sendEvent('explore.search', {
  properties: {
    query_length: searchTerm.length,
    filters_used: [...],
    latitude: userLocation?.lat,
    longitude: userLocation?.lng,
  },
}, true); // debounce = true
```

### Branch View
```javascript
TelemetryClient.sendEvent('branch.view', {
  company_id: companyId,
  branch_id: branchId,
  entity_type: 'branch',
  entity_id: branchId,
});
```

## API Endpoints

### POST `/api/telemetry`
Request body:
```json
{
  "event_name": "explore.search",
  "company_id": "uuid",
  "branch_id": "uuid",
  "entity_type": "branch",
  "entity_id": "uuid",
  "properties": {
    "query_length": 10,
    "filters_used": ["indoor", "openNow"]
  }
}
```

Response: `204 No Content`

### GET `/api/admin/behaviour`
Query parameters:
- `page` (default: 1)
- `pageSize` (default: 25)
- `from` - Date from (YYYY-MM-DD)
- `to` - Date to (YYYY-MM-DD)
- `company_id` - Filter by company
- `branch_id` - Filter by branch
- `actor_user_id` - Filter by user
- `event_name` - Filter by event (can be array)
- `device_type` - Filter by device (mobile/tablet/desktop/unknown)
- `search` - Search in entity_id, user email, or page_path

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

### GET `/api/admin/behaviour/export`
Same query parameters as above. Returns CSV file download.

## Files Created/Modified

### Backend
- `backend/src/utils/telemetry.js` (NEW)
- `backend/src/services/BehaviourService.js` (NEW)
- `backend/src/controllers/TelemetryController.js` (NEW)
- `backend/src/controllers/BehaviourController.js` (NEW)
- `backend/src/routes/telemetry.js` (NEW)
- `backend/src/routes/behaviour.js` (NEW)
- `backend/app.js` (UPDATED - added routes)
- `backend/src/middlewares/auth.js` (UPDATED - fixed optionalAuth to be async)
- `backend/src/controllers/BookingController.js` (UPDATED - added telemetry)
- `backend/src/routes/memberships.js` (UPDATED - added telemetry)
- `backend/src/routes/payments.js` (UPDATED - added telemetry)
- `backend/src/routes/gift-cards.js` (UPDATED - added telemetry)

### Frontend
- `frontend/src/api/telemetryClient.js` (NEW)
- `frontend/src/pages/admin/BehaviourPage.js` (NEW)
- `frontend/src/components/layouts/AdminLayout.js` (UPDATED - added menu item)
- `frontend/src/config/api.js` (UPDATED - added endpoints)
- `frontend/src/utils/constants.js` (UPDATED - added route)
- `frontend/src/App.js` (UPDATED - added route)
- `frontend/src/pages/customer/ExplorePage.js` (UPDATED - added tracking)
- `frontend/src/pages/customer/BranchDetailPage.js` (UPDATED - added tracking)

## Usage

### Viewing Behavior Logs
1. Login as Platform Admin
2. Navigate to "Behaviour Logs" in sidebar
3. Use filters to narrow down events (defaults to last 7 days)
4. Click "View" to see detailed properties

### Exporting Behavior Logs
1. Apply desired filters
2. Click "Export CSV" button
3. CSV file downloads with current filtered view

### Adding Frontend Tracking
```javascript
import TelemetryClient from '../api/telemetryClient';

// Track event
TelemetryClient.sendEvent('event.name', {
  company_id: 'uuid',
  properties: { key: 'value' },
});

// Track page view
TelemetryClient.trackPageView('/path');

// Track debounced event (for high-volume)
TelemetryClient.sendEvent('explore.search', { properties: {...} }, true);
```

## Performance Considerations

1. **Debouncing**: High-volume events like `explore.search` are debounced (2 seconds)
2. **Server-Side Pagination**: Never loads all events at once
3. **Default Date Range**: Last 7 days to reduce initial load
4. **Rate Limiting**: Prevents abuse of telemetry endpoint
5. **Silent Failure**: Telemetry failures don't break the app

## Future Enhancements

1. Real-time behavior dashboard
2. Funnel analysis
3. User journey mapping
4. A/B test event tracking
5. Custom event properties validation
6. Event sampling for very high-volume events
7. Retention policies for old events



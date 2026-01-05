# Pickleball Booking Backend

Multi-tenant sports booking platform backend built with Node.js, Express, and Sequelize (MySQL 8).

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Update `.env` with your database credentials:
```
DB_HOST=localhost
DB_PORT=3306
DB_NAME=pickleball_booking
DB_USER=root
DB_PASSWORD=your_password
```

4. Bootstrap database (creates DB if missing and syncs schema):
```bash
npm run bootstrap
```

5. Seed initial data:
```bash
npm run seed
```

Note: For production, use migrations instead of bootstrap:
```bash
npm run migrate
```

7. Start server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User signup
- `POST /api/auth/login` - User login
- `POST /api/auth/otp/request` - Request OTP
- `POST /api/auth/otp/verify` - Verify OTP
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user
- `PATCH /api/auth/me` - Update current user

### Companies
- `POST /api/companies/:companyId/subscribe` - Subscribe to company
- `DELETE /api/companies/:companyId/subscribe` - Unsubscribe from company
- `GET /api/companies/me/companies` - Get user's companies

### Bookings
- `POST /api/companies/:companyId/bookings` - Create booking
- `GET /api/companies/:companyId/bookings` - List bookings
- `GET /api/companies/:companyId/bookings/:bookingId` - Get booking
- `POST /api/companies/:companyId/bookings/:bookingId/cancel` - Cancel booking

## Example Requests

### Signup
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "user@example.com",
    "password": "password123"
  }'
```

### Create Booking
```bash
curl -X POST http://localhost:3000/api/companies/{companyId}/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "branch_id": "branch-uuid",
    "items": [{
      "court_id": "court-uuid",
      "service_id": "service-uuid",
      "start_datetime": "2024-01-15T10:00:00Z",
      "end_datetime": "2024-01-15T11:00:00Z"
    }]
  }'
```

## Default Admin Credentials

- Email: `admin@example.com`
- Password: `admin123`

## Notes

- OTP code is always `123456` in development (set `OTP_DEBUG=true` in `.env`)
- Payment processing is mocked
- All timestamps are in UTC


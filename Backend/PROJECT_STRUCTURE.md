# Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js          # Sequelize configuration
│   │   ├── env.js               # Environment variables
│   │   └── logger.js            # Winston logger
│   ├── models/                  # Sequelize models (all DBML tables)
│   │   ├── index.js             # Model exports and associations
│   │   ├── User.js
│   │   ├── Company.js
│   │   ├── Booking.js
│   │   └── ... (all DBML tables)
│   ├── migrations/              # Database migrations
│   ├── seeders/                 # Database seeders
│   ├── services/
│   │   ├── BaseService.js       # Base CRUD service
│   │   ├── AuthService.js
│   │   ├── BookingService.js
│   │   ├── MembershipService.js
│   │   ├── PaymentService.js
│   │   ├── WalletService.js
│   │   ├── GiftCardService.js
│   │   └── MediaService.js
│   ├── controllers/
│   │   ├── BaseController.js    # Base CRUD controller
│   │   ├── AuthController.js
│   │   └── BookingController.js
│   ├── routes/
│   │   ├── CrudRouterFactory.js # Auto CRUD router generator
│   │   ├── auth.js
│   │   ├── companies.js
│   │   ├── bookings.js
│   │   ├── memberships.js
│   │   ├── payments.js
│   │   ├── wallet.js
│   │   ├── gift-cards.js
│   │   └── media.js
│   ├── middlewares/
│   │   ├── auth.js              # JWT authentication
│   │   ├── rbac.js              # Role-based access control
│   │   ├── tenant.js            # Multi-tenant validation
│   │   ├── validate.js          # Request validation
│   │   ├── errorHandler.js     # Error handling
│   │   ├── idempotency.js      # Idempotency keys
│   │   └── upload.js           # File upload (multer)
│   ├── validators/              # Express-validator schemas
│   └── utils/
│       ├── errors.js            # Custom error classes
│       ├── response.js          # Response helpers
│       └── uuid.js              # UUID utilities
├── scripts/
│   ├── bootstrap.js             # Database bootstrap (creates DB)
│   ├── migrate.js               # Run migrations (Umzug)
│   └── seed.js                  # Seed initial data
├── app.js                       # Express app setup
├── server.js                    # Server entry point
├── package.json
├── .env.example
└── README.md
```

## Key Features

- **MVC Architecture**: Models, Services, Controllers, Routes
- **Base Classes**: BaseService, BaseController, CrudRouterFactory for code reuse
- **Multi-tenancy**: Company/Branch scoping with middleware
- **RBAC**: Role-based access control (platform_super_admin, company_admin, branch_manager, customer)
- **Authentication**: JWT with refresh tokens, OTP support (mocked)
- **Database**: Sequelize ORM with MySQL 8
- **Migrations**: Umzug for migration management
- **Error Handling**: Centralized error handler with custom error classes
- **Validation**: Express-validator with custom validate middleware
- **File Upload**: Multer with LONGBLOB storage in MySQL

## Database Schema

All models are generated from `pickleball_booking_erd.dbml`:
- 50+ tables covering users, companies, branches, courts, bookings, memberships, payments, gift cards, media, etc.
- All enums, relationships, and constraints match DBML exactly

## API Endpoints

### Authentication
- POST /api/auth/signup
- POST /api/auth/login
- POST /api/auth/otp/request
- POST /api/auth/otp/verify
- POST /api/auth/refresh
- POST /api/auth/logout
- GET /api/auth/me
- PATCH /api/auth/me

### Companies
- POST /api/companies/:companyId/subscribe
- DELETE /api/companies/:companyId/subscribe
- GET /api/companies/me/companies

### Bookings
- POST /api/companies/:companyId/bookings
- GET /api/companies/:companyId/bookings
- GET /api/companies/:companyId/bookings/:bookingId
- POST /api/companies/:companyId/bookings/:bookingId/cancel

### Memberships
- POST /api/companies/:companyId/memberships/purchase
- GET /api/companies/:companyId/memberships
- POST /api/companies/:companyId/memberships/:id/cancel

### Payments
- POST /api/companies/:companyId/payments/intent
- POST /api/companies/:companyId/payments/confirm
- GET /api/companies/:companyId/payments/:paymentId

### Wallet
- GET /api/me/wallet?company_id=xxx
- GET /api/me/wallet/ledger?company_id=xxx

### Gift Cards
- POST /api/companies/:companyId/gift-cards/purchase
- POST /api/companies/:companyId/gift-cards/redeem
- GET /api/companies/:companyId/gift-cards/me/gift-cards
- GET /api/companies/:companyId/gift-cards/:giftCardId

### Media
- POST /api/media/upload
- GET /api/media/:mediaId
- GET /api/media?owner_type=xxx&owner_id=xxx
- PATCH /api/media/:mediaId
- DELETE /api/media/:mediaId




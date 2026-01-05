# Mock Data Generation Guide

This guide explains how to generate and import mock data for the application.

## Quick Start

### Step 1: Generate Mock Data CSV Files

Run the generation script from the project root:

```bash
node generate-mock-data-complete.js
```

Or use the npm script from the Backend directory:

```bash
cd Backend
npm run generate:mock
```

This will create CSV files in the `mock-data/` directory with comprehensive test data including:
- **5 companies** with multiple branches
- **153 users** (platform admin, company admins, branch managers, staff, customers)
- **14 branches** across all companies
- **76 courts** with features and rate rules
- **200 bookings** with items and participants
- **14 membership plans** with benefits
- **10 campaigns** with promo codes
- **25 gift cards**
- **500 audit log entries**
- And much more...

### Step 2: Import CSV Data into Database

After generating the CSV files, import them into your database:

```bash
cd Backend
npm run import:csv
```

This will:
- Read all CSV files from `mock-data/` directory
- Import data in the correct order (respecting foreign key dependencies)
- Use transactions for data integrity
- Skip duplicate entries
- Show progress for each table

## Prerequisites

1. **Database must be created and migrations run:**
   ```bash
   cd Backend
   npm run migrate
   ```

2. **Ensure `.env` file is configured** with database credentials:
   ```
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=your_database_name
   DB_USER=your_username
   DB_PASSWORD=your_password
   ```

## What Gets Generated

The `generate-mock-data-complete.js` script creates CSV files for all major tables:

### Core Data
- **Roles & Permissions**: 5 roles, 12 permissions, role-permission mappings
- **Users**: 153 users with various roles
- **Auth Identities**: Email/password auth for all users
- **Companies**: 5 companies with realistic names
- **Branches**: 14 branches (2-3 per company)
- **Courts**: 76 courts with features
- **Services**: Court rental and equipment services
- **Bookings**: 200 bookings with items and participants
- **Payments**: Payment records for bookings
- **Membership Plans**: 14 plans with benefits
- **Campaigns**: 10 campaigns with promo codes
- **Gift Cards**: 25 gift cards
- **Audit Logs**: 500 activity log entries

### Supporting Data
- Branch contacts, amenities, business hours
- Court features and rate rules
- Booking change logs
- Company customers
- OTP codes
- And more...

## File Locations

- **Generation Script**: `generate-mock-data-complete.js` (project root)
- **CSV Output**: `mock-data/*.csv` (project root)
- **Import Script**: `Backend/scripts/import-csv-data.js`
- **NPM Scripts**: 
  - `npm run generate:mock` (from Backend directory)
  - `npm run import:csv` (from Backend directory)

## Regenerating Data

To regenerate fresh mock data:

1. **Option 1**: Just regenerate and re-import
   ```bash
   node generate-mock-data-complete.js
   cd Backend
   npm run import:csv
   ```
   (The import script uses `ignoreDuplicates: true`, so it will skip existing records)

2. **Option 2**: Clear database and start fresh
   ```bash
   cd Backend
   npm run migrate:undo  # Undo all migrations
   npm run migrate      # Re-run migrations
   node ../generate-mock-data-complete.js  # Generate fresh data
   npm run import:csv   # Import fresh data
   ```

## Troubleshooting

**Error: Cannot find module**
- Make sure you're running from the correct directory
- The script uses Node.js built-in modules, no dependencies needed

**Error: CSV files not generated**
- Check that the `mock-data/` directory exists or can be created
- Check file permissions

**Error: Import fails with foreign key constraint**
- Make sure migrations are up to date: `npm run migrate`
- The import script handles dependencies, but ensure all parent tables exist

**Empty CSV files**
- Some tables (like `court_rate_rules`, `resource_blocks`) are intentionally empty
- This is normal - they're placeholders for optional data

## Alternative: Using Seed Scripts

If you prefer programmatic seeding instead of CSV:

```bash
cd Backend
npm run seed        # Basic seed (minimal data)
npm run seed:full  # Comprehensive seed (full dataset)
```

The seed scripts create data directly in the database without CSV files.

## Data Characteristics

The generated mock data includes:
- **Realistic dates**: Spread across the past year
- **Valid relationships**: All foreign keys properly linked
- **Varied statuses**: Mix of active, inactive, pending, etc.
- **Realistic names**: Company names, user names, addresses
- **Proper formatting**: UUIDs, dates, timestamps all correctly formatted
- **Complete records**: All required fields populated

This provides comprehensive test data for development and testing of all application features.


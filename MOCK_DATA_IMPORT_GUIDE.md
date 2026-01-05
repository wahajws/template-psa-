# Mock Data CSV Import Guide

## Quick Start

The mock data CSV files can be imported into the database using the import script.

### Prerequisites

1. Database must be created and migrations run:
   ```bash
   cd backend
   npm run migrate
   ```

2. Ensure `.env` file is configured with database credentials:
   ```
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=your_database_name
   DB_USER=your_username
   DB_PASSWORD=your_password
   ```

### Import CSV Data

Run the import script:

```bash
cd backend
npm run import:csv
```

This will:
- Read all CSV files from `mock-data/` directory
- Import data in the correct order (respecting foreign key dependencies)
- Use transactions for data integrity
- Skip duplicate entries (ignoreDuplicates: true)
- Show progress for each table

### What Gets Imported

The script imports data for all tables in this order:

1. **RBAC & Users**: roles, permissions, users, user_roles, auth_identities
2. **Organizations**: companies, branches, contacts, amenities, staff, business hours
3. **Courts & Services**: courts, court features, services
4. **Memberships**: membership plans, benefits, customer memberships
5. **Bookings**: bookings, booking items, participants, change logs
6. **Campaigns**: campaigns, promo codes, discount applications
7. **Payments**: payments, refunds, invoices
8. **Gift Cards**: gift cards, redemptions
9. **Audit Logs**: audit logs (including behavior events)
10. **Other**: reviews, support tickets, media, notifications, etc.

### Import Statistics

After running, you should see output like:

```
✓ roles.csv (5 rows imported)
✓ permissions.csv (12 rows imported)
✓ users.csv (153 rows imported)
✓ companies.csv (5 rows imported)
✓ branches.csv (14 rows imported)
✓ courts.csv (76 rows imported)
✓ bookings.csv (200 rows imported)
✓ audit_logs.csv (500 rows imported)
...
✓ All CSV data imported successfully!
```

### Troubleshooting

**Error: Table doesn't exist**
- Run migrations first: `npm run migrate`

**Error: Foreign key constraint fails**
- The script imports in dependency order, but if you see this, ensure all parent tables are imported first
- Try running the import again (it uses `ignoreDuplicates: true`)

**Error: CSV file not found**
- Ensure CSV files are in `mock-data/` directory at project root
- Check file names match table names exactly (e.g., `bookings.csv` not `booking.csv`)

**Empty files**
- Empty CSV files (0 rows) are skipped - this is normal for optional tables

### Manual Import (Alternative)

If you prefer to import manually using MySQL:

```sql
-- Example for bookings table
LOAD DATA LOCAL INFILE 'mock-data/bookings.csv'
INTO TABLE bookings
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;
```

**Note**: This requires MySQL client with `LOCAL` enabled and proper file permissions.

### Re-importing Data

The script uses `ignoreDuplicates: true`, so you can safely run it multiple times. To completely replace data:

1. **Option 1**: Truncate tables first
   ```sql
   SET FOREIGN_KEY_CHECKS = 0;
   TRUNCATE TABLE bookings;
   TRUNCATE TABLE booking_items;
   -- ... repeat for all tables
   SET FOREIGN_KEY_CHECKS = 1;
   ```

2. **Option 2**: Drop and recreate database
   ```bash
   npm run migrate:undo  # Undo all migrations
   npm run migrate      # Re-run migrations
   npm run import:csv   # Import fresh data
   ```

### File Locations

- **CSV Files**: `mock-data/*.csv` (project root)
- **Import Script**: `backend/scripts/import-csv-data.js`
- **NPM Script**: `npm run import:csv` (in backend directory)

### Data Volume

The mock data includes:
- 5 companies
- 14 branches
- 153 users
- 76 courts
- 200 bookings
- 14 membership plans
- 10 campaigns
- 25 gift cards
- 500 audit log entries
- And more...

This provides comprehensive test data for all consoles and features.



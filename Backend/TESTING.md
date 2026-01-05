# API Testing Guide

## Quick Start

1. **Start the server:**
   ```bash
   npm start
   ```

2. **Run the API tests:**
   ```bash
   npm run test:apis
   ```

   Or directly:
   ```bash
   node scripts/test-apis.js
   ```

## What the Test Script Does

The test script (`scripts/test-apis.js`) automatically tests all major API endpoints:

### Test Categories

1. **Authentication** (Signup, Login, OTP, Sessions)
2. **Platform Admin** (Companies CRUD)
3. **Company Subscriptions** (Subscribe/Unsubscribe)
4. **Company Admin** (Branches, Courts, Services, Membership Plans)
5. **Availability** (Branch availability checks)
6. **Bookings** (Create, List, Cancel)
7. **Memberships** (List user memberships)
8. **Payments** (Payment intents)
9. **Gift Cards** (List user gift cards)
10. **Wallet** (Balance and ledger)
11. **Reviews** (List reviews)
12. **Support Tickets** (Create, List)

### Test Results

The script outputs:
- ✅ **PASS** - Test passed (green)
- ✗ **FAIL** - Test failed (red)
- ⏭ **SKIP** - Test skipped (yellow, usually due to missing prerequisites)

At the end, you'll see a summary with:
- Total passed/failed/skipped
- Success rate percentage
- List of errors (if any)

## Prerequisites

1. **Server must be running** on port 3000 (default)
2. **Database must be seeded** with initial data:
   ```bash
   npm run seed
   ```
   This creates:
   - Platform super admin user (`admin@platform.com` / `Admin123!`)
   - Roles and permissions

3. **Test data flow:**
   - Script creates a test user via signup
   - Creates a test company (if platform admin token available)
   - Creates branches, courts, services, etc.
   - Tests all endpoints with the created data

## Customization

### Change Base URL

Edit `scripts/test-apis.js`:
```javascript
const BASE_URL = `http://localhost:${config.PORT || 3000}`;
```

### Add More Tests

Add new test cases in the appropriate section:
```javascript
await test('GET /api/your-endpoint', async () => {
  return makeRequest('GET', '/api/your-endpoint', {
    token: testData.tokens.customer
  });
}, { expectStatus: 200 });
```

### Skip Tests

Mark tests as skipped:
```javascript
await test('GET /api/endpoint', async () => {
  // ...
}, { skip: true });
```

## Troubleshooting

### "Connection refused" or "ECONNREFUSED"
- Make sure the server is running: `npm start`
- Check the port in `.env` matches the test script

### "401 Unauthorized"
- Check if authentication tokens are being generated correctly
- Verify user credentials in seed data

### "404 Not Found"
- Verify the endpoint path matches the route definition
- Check if the route is registered in `app.js`

### "Missing required data"
- Some tests depend on previous tests creating data
- Run the full test suite in order
- Check if seed data exists (companies, branches, etc.)

## Test Data Cleanup

The test script creates test data but doesn't clean it up. To clean up:

1. **Manual cleanup via API:**
   - Delete test companies, branches, etc. via admin endpoints

2. **Database reset:**
   ```bash
   # Drop and recreate database
   npm run bootstrap
   npm run seed
   ```

## Advanced Usage

### Test Specific Endpoints Only

Comment out sections you don't want to test:
```javascript
// ============================================================================
// 5. AVAILABILITY TESTS
// ============================================================================
// ... comment out this entire section
```

### Verbose Output

Add console.log statements to see request/response details:
```javascript
const result = await makeRequest('GET', '/api/endpoint', { token });
console.log('Request:', result);
```

## Integration with CI/CD

The script exits with code 1 if any tests fail, making it suitable for CI/CD:

```yaml
# Example GitHub Actions
- name: Test APIs
  run: npm run test:apis
```

## Next Steps

- Add more comprehensive test cases
- Add validation for response data structure
- Add performance testing
- Add load testing with multiple concurrent requests
- Integrate with Jest or Mocha for better test reporting



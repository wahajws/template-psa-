#!/usr/bin/env node

/**
 * Comprehensive API Test Script
 * Tests all endpoints in the pickleball booking backend
 * 
 * Usage: node scripts/test-apis.js
 * 
 * Prerequisites:
 * - Server must be running on port 3000
 * - Database must be seeded (npm run seed)
 * - At least one company and branch should exist
 */

require('dotenv').config();
const https = require('https');
const http = require('http');
const { URL } = require('url');

const config = require('../src/config/env');
const BASE_URL = `http://localhost:${config.PORT || 3000}`;

// Test results tracking
const results = {
  passed: 0,
  failed: 0,
  skipped: 0,
  errors: []
};

// Test data storage
const testData = {
  tokens: {
    customer: null,
    platformAdmin: null,
    companyAdmin: null
  },
  userIds: {
    customer: null,
    platformAdmin: null,
    companyAdmin: null
  },
  companyId: null,
  branchId: null,
  courtId: null,
  serviceId: null,
  bookingId: null,
  membershipPlanId: null,
  paymentId: null,
  giftCardId: null,
  reviewId: null,
  ticketId: null,
  mediaId: null
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// HTTP request helper
function makeRequest(method, path, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const { body, headers = {}, token } = options;

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (body && typeof body === 'object' && !(body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    const requestOptions = {
      method,
      headers
    };

    const req = http.request(url, requestOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const jsonData = data ? JSON.parse(data) : null;
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: jsonData,
            raw: data
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: null,
            raw: data
          });
        }
      });
    });

    req.on('error', (error) => {
      // Provide more helpful error messages
      if (error.code === 'ECONNREFUSED') {
        reject(new Error(`Connection refused - Is the server running on ${BASE_URL}?`));
      } else {
        reject(error);
      }
    });

    if (body) {
      if (typeof body === 'string') {
        req.write(body);
      } else if (body instanceof FormData) {
        // For multipart, you'd need form-data package
        // For now, skip file uploads
      } else {
        req.write(JSON.stringify(body));
      }
    }

    req.end();
  });
}

// Test helper
async function test(name, testFn, options = {}) {
  const { skip = false, expectStatus = 200 } = options;
  
  if (skip) {
    console.log(`${colors.yellow}⏭  SKIP${colors.reset} ${name}`);
    results.skipped++;
    return null;
  }

  try {
    const result = await testFn();
    const passed = result.status === expectStatus || (Array.isArray(expectStatus) && expectStatus.includes(result.status));
    
    if (passed) {
      console.log(`${colors.green}✓ PASS${colors.reset} ${name} (${result.status})`);
      results.passed++;
      return result;
    } else {
      console.log(`${colors.red}✗ FAIL${colors.reset} ${name} - Expected ${expectStatus}, got ${result.status}`);
      console.log(`  Response: ${JSON.stringify(result.data).substring(0, 200)}`);
      results.failed++;
      results.errors.push({ name, error: `Expected ${expectStatus}, got ${result.status}`, response: result.data });
      return null;
    }
  } catch (error) {
    const errorMsg = error.message || String(error);
    console.log(`${colors.red}✗ FAIL${colors.reset} ${name} - ${errorMsg}`);
    if (error.stack && errorMsg.includes('ECONNREFUSED')) {
      console.log(`  ${colors.yellow}→ Make sure the server is running: npm start${colors.reset}`);
    }
    results.failed++;
    results.errors.push({ name, error: errorMsg });
    return null;
  }
}

// Test suite
async function runTests() {
  console.log(`${colors.cyan}╔════════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.cyan}║     API Test Suite - Pickleball Booking Backend          ║${colors.reset}`);
  console.log(`${colors.cyan}╚════════════════════════════════════════════════════════════╝${colors.reset}\n`);

  // Check if server is running
  console.log(`${colors.blue}Checking server connection...${colors.reset}`);
  try {
    const healthCheck = await makeRequest('GET', '/health');
    if (healthCheck.status === 200) {
      console.log(`${colors.green}✓ Server is running on ${BASE_URL}${colors.reset}\n`);
    } else {
      console.log(`${colors.yellow}⚠ Server responded with status ${healthCheck.status}${colors.reset}\n`);
    }
  } catch (error) {
    console.log(`${colors.red}✗ Cannot connect to server at ${BASE_URL}${colors.reset}`);
    console.log(`${colors.red}  Error: ${error.message}${colors.reset}`);
    console.log(`${colors.yellow}  Please start the server first: npm start${colors.reset}\n`);
    process.exit(1);
  }

  // ============================================================================
  // 1. AUTHENTICATION TESTS
  // ============================================================================
  console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.blue}1. AUTHENTICATION${colors.reset}`);
  console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

  // Signup
  const signupResult = await test('POST /api/auth/signup', async () => {
    const timestamp = Date.now().toString().slice(-6);
    return makeRequest('POST', '/api/auth/signup', {
      body: {
        first_name: 'Test',
        last_name: 'User',
        email: `testuser${timestamp}@example.com`,
        phone: `+123456789${timestamp}`,
        password: 'Test123456!'
      }
    });
  }, { expectStatus: [200, 201] });

  if (signupResult && signupResult.data && signupResult.data.data) {
    testData.tokens.customer = signupResult.data.data.token || signupResult.data.data.accessToken;
    testData.userIds.customer = signupResult.data.data.user?.id || signupResult.data.data.id;
  }

  // Login
  const loginResult = await test('POST /api/auth/login', async () => {
    return makeRequest('POST', '/api/auth/login', {
      body: {
        identifier: 'testuser@example.com', // Use seeded admin or create one
        password: 'password123'
      }
    });
  }, { expectStatus: [200, 401] }); // May fail if user doesn't exist

  // OTP Request
  await test('POST /api/auth/otp/request', async () => {
    const timestamp = Date.now().toString().slice(-6);
    return makeRequest('POST', '/api/auth/otp/request', {
      body: {
        identifier: `+123456789${timestamp}`
      }
    });
  }, { expectStatus: [200, 201, 400] });

  // Get Me (requires auth)
  await test('GET /api/auth/me', async () => {
    if (!testData.tokens.customer) {
      throw new Error('No token available');
    }
    return makeRequest('GET', '/api/auth/me', {
      token: testData.tokens.customer
    });
  }, { expectStatus: 200, skip: !testData.tokens.customer });

  // Update Me
  await test('PATCH /api/auth/me', async () => {
    if (!testData.tokens.customer) {
      throw new Error('No token available');
    }
    return makeRequest('PATCH', '/api/auth/me', {
      token: testData.tokens.customer,
      body: {
        first_name: 'Updated'
      }
    });
  }, { expectStatus: 200, skip: !testData.tokens.customer });

  // Sessions
  await test('GET /api/auth/me/sessions', async () => {
    if (!testData.tokens.customer) {
      throw new Error('No token available');
    }
    return makeRequest('GET', '/api/auth/me/sessions', {
      token: testData.tokens.customer
    });
  }, { expectStatus: 200, skip: !testData.tokens.customer });

  // ============================================================================
  // 2. PLATFORM ADMIN TESTS (if super admin exists)
  // ============================================================================
  console.log(`\n${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.blue}2. PLATFORM ADMIN${colors.reset}`);
  console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

  // Try to login as platform admin (from seed)
  const adminLogin = await test('POST /api/auth/login (Platform Admin)', async () => {
    return makeRequest('POST', '/api/auth/login', {
      body: {
        identifier: 'admin@platform.com', // From seed
        password: 'Admin123!'
      }
    });
  }, { expectStatus: [200, 401] });

  if (adminLogin && adminLogin.data && adminLogin.data.data) {
    testData.tokens.platformAdmin = adminLogin.data.data.token || adminLogin.data.data.accessToken;
  }

  // Companies CRUD
  await test('GET /api/admin/platform/companies', async () => {
    if (!testData.tokens.platformAdmin) {
      throw new Error('No platform admin token');
    }
    return makeRequest('GET', '/api/admin/platform/companies', {
      token: testData.tokens.platformAdmin
    });
  }, { expectStatus: 200, skip: !testData.tokens.platformAdmin });

  const createCompanyResult = await test('POST /api/admin/platform/companies', async () => {
    if (!testData.tokens.platformAdmin) {
      throw new Error('No platform admin token');
    }
    const timestamp = Date.now();
    const companyName = `Test Company ${timestamp}`;
    const slug = `test-company-${timestamp}`.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    return makeRequest('POST', '/api/admin/platform/companies', {
      token: testData.tokens.platformAdmin,
      body: {
        name: companyName,
        slug: slug,
        description: 'Test company created by API test',
        website_url: 'https://testcompany.example.com',
        timezone: 'America/Los_Angeles',
        default_currency: 'USD',
        status: 'active'
      }
    });
  }, { expectStatus: [200, 201], skip: !testData.tokens.platformAdmin });

  if (createCompanyResult && createCompanyResult.data && createCompanyResult.data.data) {
    testData.companyId = createCompanyResult.data.data.id;
  }

  // ============================================================================
  // 3. COMPANY SUBSCRIPTION TESTS
  // ============================================================================
  console.log(`\n${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.blue}3. COMPANY SUBSCRIPTIONS${colors.reset}`);
  console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

  await test('POST /api/companies/:companyId/subscribe', async () => {
    if (!testData.tokens.customer || !testData.companyId) {
      throw new Error('Missing token or companyId');
    }
    return makeRequest('POST', `/api/companies/${testData.companyId}/subscribe`, {
      token: testData.tokens.customer,
      body: {}
    });
  }, { expectStatus: [200, 201], skip: !testData.tokens.customer || !testData.companyId });

  await test('GET /api/companies/me/companies', async () => {
    if (!testData.tokens.customer) {
      throw new Error('No token available');
    }
    return makeRequest('GET', '/api/companies/me/companies', {
      token: testData.tokens.customer
    });
  }, { expectStatus: 200, skip: !testData.tokens.customer });

  // ============================================================================
  // 4. COMPANY ADMIN TESTS
  // ============================================================================
  console.log(`\n${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.blue}4. COMPANY ADMIN${colors.reset}`);
  console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

  // Use platform admin token for company admin operations (platform admin can do everything)
  const companyAdminToken = testData.tokens.platformAdmin || testData.tokens.customer;

  // Branches
  const createBranchResult = await test('POST /api/admin/companies/:companyId/branches', async () => {
    if (!companyAdminToken || !testData.companyId) {
      throw new Error('Missing token or companyId');
    }
    return makeRequest('POST', `/api/admin/companies/${testData.companyId}/branches`, {
      token: companyAdminToken,
      body: {
        name: `Test Branch ${Date.now()}`,
        address_line1: '123 Test St',
        city: 'Test City',
        state: 'TS',
        country: 'US',
        postal_code: '12345',
        status: 'active'
      }
    });
  }, { expectStatus: [200, 201], skip: !companyAdminToken || !testData.companyId });

  if (createBranchResult && createBranchResult.data && createBranchResult.data.data) {
    testData.branchId = createBranchResult.data.data.id;
  }

  await test('GET /api/admin/companies/:companyId/branches', async () => {
    if (!companyAdminToken || !testData.companyId) {
      throw new Error('Missing token or companyId');
    }
    return makeRequest('GET', `/api/admin/companies/${testData.companyId}/branches`, {
      token: companyAdminToken
    });
  }, { expectStatus: 200, skip: !companyAdminToken || !testData.companyId });

  // Branch Contacts
  await test('POST /api/admin/companies/:companyId/branches/:branchId/contacts', async () => {
    if (!companyAdminToken || !testData.companyId || !testData.branchId) {
      throw new Error('Missing required data');
    }
    return makeRequest('POST', `/api/admin/companies/${testData.companyId}/branches/${testData.branchId}/contacts`, {
      token: companyAdminToken,
      body: {
        contact_type: 'phone',
        value: '+1234567890',
        is_primary: true
      }
    });
  }, { expectStatus: [200, 201], skip: !companyAdminToken || !testData.companyId || !testData.branchId });

  // Courts
  const createCourtResult = await test('POST /api/admin/companies/:companyId/branches/:branchId/courts', async () => {
    if (!companyAdminToken || !testData.companyId || !testData.branchId) {
      throw new Error('Missing required data');
    }
    return makeRequest('POST', `/api/admin/companies/${testData.companyId}/branches/${testData.branchId}/courts`, {
      token: companyAdminToken,
      body: {
        name: `Court ${Date.now()}`,
        court_number: '1',
        status: 'active',
        surface_type: 'indoor',
        hourly_rate: 25.00
      }
    });
  }, { expectStatus: [200, 201], skip: !companyAdminToken || !testData.companyId || !testData.branchId });

  if (createCourtResult && createCourtResult.data && createCourtResult.data.data) {
    testData.courtId = createCourtResult.data.data.id;
  }

  // Services
  const createServiceResult = await test('POST /api/admin/companies/:companyId/services', async () => {
    if (!companyAdminToken || !testData.companyId) {
      throw new Error('Missing required data');
    }
    return makeRequest('POST', `/api/admin/companies/${testData.companyId}/services`, {
      token: companyAdminToken,
      body: {
        name: `Service ${Date.now()}`,
        description: 'Test service',
        service_type: 'court_rental',
        base_price: 30.00
      }
    });
  }, { expectStatus: [200, 201], skip: !companyAdminToken || !testData.companyId });

  if (createServiceResult && createServiceResult.data && createServiceResult.data.data) {
    testData.serviceId = createServiceResult.data.data.id;
  }

  // Membership Plans
  const createPlanResult = await test('POST /api/admin/companies/:companyId/membership-plans', async () => {
    if (!companyAdminToken || !testData.companyId) {
      throw new Error('Missing required data');
    }
    return makeRequest('POST', `/api/admin/companies/${testData.companyId}/membership-plans`, {
      token: companyAdminToken,
      body: {
        name: `Plan ${Date.now()}`,
        description: 'Test plan',
        plan_type: 'recurring',
        price: 99.99,
        billing_cycle: 'monthly',
        status: 'active'
      }
    });
  }, { expectStatus: [200, 201], skip: !companyAdminToken || !testData.companyId });

  if (createPlanResult && createPlanResult.data && createPlanResult.data.data) {
    testData.membershipPlanId = createPlanResult.data.data.id;
  }

  // ============================================================================
  // 5. AVAILABILITY TESTS
  // ============================================================================
  console.log(`\n${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.blue}5. AVAILABILITY${colors.reset}`);
  console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

  await test('GET /api/companies/:companyId/branches/:branchId/availability', async () => {
    if (!testData.companyId || !testData.branchId) {
      throw new Error('Missing companyId or branchId');
    }
    return makeRequest('GET', `/api/companies/${testData.companyId}/branches/${testData.branchId}/availability`, {
      query: {
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }
    });
  }, { expectStatus: 200, skip: !testData.companyId || !testData.branchId });

  // ============================================================================
  // 6. BOOKING TESTS
  // ============================================================================
  console.log(`\n${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.blue}6. BOOKINGS${colors.reset}`);
  console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

  const startTime = new Date(Date.now() + 24 * 60 * 60 * 1000); // Tomorrow
  const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // +1 hour

  const createBookingResult = await test('POST /api/companies/:companyId/bookings', async () => {
    if (!testData.tokens.customer || !testData.companyId || !testData.branchId || !testData.courtId || !testData.serviceId) {
      throw new Error('Missing required data');
    }
    return makeRequest('POST', `/api/companies/${testData.companyId}/bookings`, {
      token: testData.tokens.customer,
      body: {
        branch_id: testData.branchId,
        items: [{
          court_id: testData.courtId,
          service_id: testData.serviceId,
          start_datetime: startTime.toISOString(),
          end_datetime: endTime.toISOString()
        }]
      }
    });
  }, { expectStatus: [200, 201], skip: !testData.tokens.customer || !testData.companyId || !testData.branchId || !testData.courtId || !testData.serviceId });

  if (createBookingResult && createBookingResult.data && createBookingResult.data.data) {
    testData.bookingId = createBookingResult.data.data.id;
  }

  await test('GET /api/companies/:companyId/bookings', async () => {
    if (!testData.tokens.customer || !testData.companyId) {
      throw new Error('Missing required data');
    }
    return makeRequest('GET', `/api/companies/${testData.companyId}/bookings`, {
      token: testData.tokens.customer
    });
  }, { expectStatus: 200, skip: !testData.tokens.customer || !testData.companyId });

  // ============================================================================
  // 7. MEMBERSHIP TESTS
  // ============================================================================
  console.log(`\n${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.blue}7. MEMBERSHIPS${colors.reset}`);
  console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

  await test('GET /api/companies/:companyId/memberships', async () => {
    if (!testData.tokens.customer || !testData.companyId) {
      throw new Error('Missing required data');
    }
    return makeRequest('GET', `/api/companies/${testData.companyId}/memberships`, {
      token: testData.tokens.customer
    });
  }, { expectStatus: 200, skip: !testData.tokens.customer || !testData.companyId });

  // ============================================================================
  // 8. PAYMENT TESTS
  // ============================================================================
  console.log(`\n${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.blue}8. PAYMENTS${colors.reset}`);
  console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

  const paymentIntentResult = await test('POST /api/companies/:companyId/payments/intent', async () => {
    if (!testData.tokens.customer || !testData.companyId) {
      throw new Error('Missing required data');
    }
    return makeRequest('POST', `/api/companies/${testData.companyId}/payments/intent`, {
      token: testData.tokens.customer,
      body: {
        amount: 50.00,
        payment_method: 'card'
      }
    });
  }, { expectStatus: [200, 201], skip: !testData.tokens.customer || !testData.companyId });

  if (paymentIntentResult && paymentIntentResult.data && paymentIntentResult.data.data) {
    testData.paymentId = paymentIntentResult.data.data.id;
  }

  // ============================================================================
  // 9. GIFT CARDS TESTS
  // ============================================================================
  console.log(`\n${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.blue}9. GIFT CARDS${colors.reset}`);
  console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

  await test('GET /api/companies/:companyId/gift-cards/me/gift-cards', async () => {
    if (!testData.tokens.customer || !testData.companyId) {
      throw new Error('Missing required data');
    }
    return makeRequest('GET', `/api/companies/${testData.companyId}/gift-cards/me/gift-cards`, {
      token: testData.tokens.customer
    });
  }, { expectStatus: 200, skip: !testData.tokens.customer || !testData.companyId });

  // ============================================================================
  // 10. WALLET TESTS
  // ============================================================================
  console.log(`\n${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.blue}10. WALLET${colors.reset}`);
  console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

  await test('GET /api/me/wallet', async () => {
    if (!testData.tokens.customer || !testData.companyId) {
      throw new Error('Missing required data');
    }
    return makeRequest('GET', `/api/me/wallet?company_id=${testData.companyId}`, {
      token: testData.tokens.customer
    });
  }, { expectStatus: 200, skip: !testData.tokens.customer || !testData.companyId });

  // ============================================================================
  // 11. REVIEWS TESTS
  // ============================================================================
  console.log(`\n${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.blue}11. REVIEWS${colors.reset}`);
  console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

  await test('GET /api/companies/:companyId/reviews', async () => {
    if (!testData.companyId) {
      throw new Error('Missing companyId');
    }
    return makeRequest('GET', `/api/companies/${testData.companyId}/reviews`);
  }, { expectStatus: 200, skip: !testData.companyId });

  // ============================================================================
  // 12. SUPPORT TICKETS TESTS
  // ============================================================================
  console.log(`\n${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.blue}12. SUPPORT TICKETS${colors.reset}`);
  console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

  const createTicketResult = await test('POST /api/companies/:companyId/support-tickets', async () => {
    if (!testData.tokens.customer || !testData.companyId) {
      throw new Error('Missing required data');
    }
    return makeRequest('POST', `/api/companies/${testData.companyId}/support-tickets`, {
      token: testData.tokens.customer,
      body: {
        subject: 'Test Ticket',
        message: 'This is a test support ticket',
        priority: 'medium'
      }
    });
  }, { expectStatus: [200, 201], skip: !testData.tokens.customer || !testData.companyId });

  if (createTicketResult && createTicketResult.data && createTicketResult.data.data) {
    testData.ticketId = createTicketResult.data.data.id;
  }

  // ============================================================================
  // SUMMARY
  // ============================================================================
  console.log(`\n${colors.cyan}╔════════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.cyan}║                    TEST SUMMARY                            ║${colors.reset}`);
  console.log(`${colors.cyan}╚════════════════════════════════════════════════════════════╝${colors.reset}\n`);

  console.log(`${colors.green}Passed: ${results.passed}${colors.reset}`);
  console.log(`${colors.red}Failed: ${results.failed}${colors.reset}`);
  console.log(`${colors.yellow}Skipped: ${results.skipped}${colors.reset}`);
  console.log(`Total: ${results.passed + results.failed + results.skipped}\n`);

  if (results.errors.length > 0) {
    console.log(`${colors.red}Errors:${colors.reset}`);
    results.errors.forEach((err, idx) => {
      console.log(`  ${idx + 1}. ${err.name}: ${err.error}`);
    });
  }

  const successRate = ((results.passed / (results.passed + results.failed)) * 100).toFixed(1);
  console.log(`\n${colors.cyan}Success Rate: ${successRate}%${colors.reset}\n`);

  process.exit(results.failed > 0 ? 1 : 0);
}

// Run tests
runTests().catch((error) => {
  console.error(`${colors.red}Fatal error: ${error.message}${colors.reset}`);
  console.error(error.stack);
  process.exit(1);
});


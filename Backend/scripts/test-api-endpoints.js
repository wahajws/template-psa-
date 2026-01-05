require('dotenv').config();
const axios = require('axios');

const API_BASE_URL = process.env.API_URL || 'http://localhost:3000/api';
let accessToken = null;

async function login() {
  try {
    console.log('Logging in as admin...');
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      identifier: 'admin@platform.com',
      password: 'Admin123!'
    });
    
    if (response.data.data && response.data.data.token) {
      accessToken = response.data.data.token;
      console.log('✓ Login successful\n');
      return true;
    } else {
      console.log('✗ Login failed: No token in response');
      return false;
    }
  } catch (error) {
    console.log('✗ Login failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testEndpoint(method, endpoint, data = null) {
  try {
    const config = {
      method: method.toLowerCase(),
      url: `${API_BASE_URL}${endpoint}`,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    };
    
    if (data) {
      config.data = data;
    }
    
    const response = await axios(config);
    return { success: true, status: response.status, data: response.data };
  } catch (error) {
    return {
      success: false,
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    };
  }
}

async function runTests() {
  console.log('='.repeat(60));
  console.log('API ENDPOINT TESTS');
  console.log('='.repeat(60));
  
  // Login first
  const loggedIn = await login();
  if (!loggedIn) {
    console.log('\nCannot proceed without authentication. Exiting.');
    process.exit(1);
  }

  const tests = [
    {
      name: 'GET /api/admin/activity',
      method: 'GET',
      endpoint: '/admin/activity?page=1&pageSize=10',
      expectedStatus: 200
    },
    {
      name: 'GET /api/admin/platform/companies',
      method: 'GET',
      endpoint: '/admin/platform/companies',
      expectedStatus: 200
    },
    {
      name: 'POST /api/admin/platform/companies (Create)',
      method: 'POST',
      endpoint: '/admin/platform/companies',
      data: {
        name: 'Test Company API',
        slug: 'test-company-api',
        description: 'Test company from API test',
        website_url: 'https://test.com',
        timezone: 'UTC',
        default_currency: 'USD',
        status: 'active'
      },
      expectedStatus: 201
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    console.log(`\n[Test] ${test.name}`);
    const result = await testEndpoint(test.method, test.endpoint, test.data);
    
    if (result.success && result.status === test.expectedStatus) {
      console.log(`  ✓ PASSED (Status: ${result.status})`);
      passed++;
    } else {
      console.log(`  ✗ FAILED`);
      console.log(`    Expected: ${test.expectedStatus}`);
      console.log(`    Got: ${result.status || 'N/A'}`);
      if (result.message) {
        console.log(`    Error: ${result.message}`);
      }
      failed++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('TEST RESULTS');
  console.log('='.repeat(60));
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total: ${tests.length}`);
  console.log('='.repeat(60) + '\n');

  process.exit(failed > 0 ? 1 : 0);
}

// Check if server is running
axios.get(`${API_BASE_URL.replace('/api', '')}/health`)
  .then(() => {
    console.log('✓ Server is running\n');
    runTests();
  })
  .catch(() => {
    console.log('✗ Server is not running. Please start it first:');
    console.log('  cd Backend && npm start\n');
    process.exit(1);
  });


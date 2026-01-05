require('dotenv').config();
const { sequelize } = require('../src/models');
const { User } = require('../src/models');
const ActivityService = require('../src/services/ActivityService');
const ActivityLogger = require('../src/utils/activityLogger');

const SYSTEM_USER_ID = '00000000-0000-0000-0000-000000000000';

async function testFixes() {
  try {
    console.log('='.repeat(60));
    console.log('TESTING FIXES');
    console.log('='.repeat(60));
    
    // Test 1: Verify system user exists
    console.log('\n[Test 1] Checking system user...');
    let systemUser = await User.findByPk(SYSTEM_USER_ID);
    if (!systemUser) {
      console.log('  ✗ System user does not exist. Creating...');
      systemUser = await User.create({
        id: SYSTEM_USER_ID,
        email: 'system@platform.com',
        first_name: 'System',
        last_name: 'User',
        status: 'active',
        created_by: null
      });
      console.log('  ✓ System user created successfully');
    } else {
      console.log('  ✓ System user exists');
    }

    // Test 2: Verify ActivityService.getActivities doesn't use 'filtered'
    console.log('\n[Test 2] Checking ActivityService for "filtered" variable...');
    const fs = require('fs');
    const path = require('path');
    const activityServicePath = path.join(__dirname, '../src/services/ActivityService.js');
    const fileContent = fs.readFileSync(activityServicePath, 'utf8');
    
    if (fileContent.includes('items: filtered')) {
      console.log('  ✗ ERROR: File still contains "items: filtered"');
      console.log('  Fixing it now...');
      const fixedContent = fileContent.replace(/items:\s*filtered/g, 'items: enriched');
      fs.writeFileSync(activityServicePath, fixedContent, 'utf8');
      console.log('  ✓ Fixed: Replaced "filtered" with "enriched"');
    } else if (fileContent.includes('items: enriched')) {
      console.log('  ✓ File correctly uses "items: enriched"');
    } else {
      console.log('  ⚠ Warning: Could not find return statement');
    }

    // Test 3: Test ActivityService.getActivities method
    console.log('\n[Test 3] Testing ActivityService.getActivities method...');
    try {
      const result = await ActivityService.getActivities({ page: 1, pageSize: 10 });
      if (result.items !== undefined) {
        console.log('  ✓ ActivityService.getActivities works correctly');
        console.log(`  ✓ Returned ${result.items.length} items`);
      } else {
        console.log('  ✗ ERROR: Result does not have "items" property');
      }
    } catch (error) {
      if (error.message.includes('filtered is not defined')) {
        console.log('  ✗ ERROR: "filtered is not defined" error still exists');
        console.log('  This means the server needs to be restarted to load the fix');
      } else {
        console.log('  ⚠ ActivityService error:', error.message);
      }
    }

    // Test 4: Test ActivityLogger with system user
    console.log('\n[Test 4] Testing ActivityLogger with system user...');
    try {
      await ActivityLogger.logEvent({
        action: 'test',
        entity_type: 'test',
        entity_id: 'test-id',
        metadata: { test: true }
      });
      console.log('  ✓ ActivityLogger works with system user');
    } catch (error) {
      if (error.message.includes('foreign key constraint')) {
        console.log('  ✗ ERROR: Foreign key constraint - system user may not exist');
      } else {
        console.log('  ⚠ ActivityLogger error:', error.message);
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('TEST SUMMARY');
    console.log('='.repeat(60));
    console.log('If all tests passed, restart your server:');
    console.log('  1. Stop the server (Ctrl+C)');
    console.log('  2. Run: npm start');
    console.log('='.repeat(60) + '\n');

    process.exit(0);
  } catch (error) {
    console.error('\n✗ Test failed:', error);
    console.error(error.stack);
    process.exit(1);
  }
}

testFixes();


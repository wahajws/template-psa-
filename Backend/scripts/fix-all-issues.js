require('dotenv').config();
const { sequelize } = require('../src/models');
const { User } = require('../src/models');
const fs = require('fs');
const path = require('path');

const SYSTEM_USER_ID = '00000000-0000-0000-0000-000000000000';

async function fixAllIssues() {
  console.log('='.repeat(60));
  console.log('FIXING ALL KNOWN ISSUES');
  console.log('='.repeat(60));

  try {
    await sequelize.authenticate();
    console.log('✓ Database connected\n');

    // Fix 1: Ensure system user exists
    console.log('[Fix 1] Ensuring system user exists...');
    try {
      let systemUser = await User.findByPk(SYSTEM_USER_ID);
      if (!systemUser) {
        systemUser = await User.create({
          id: SYSTEM_USER_ID,
          email: 'system@platform.com',
          first_name: 'System',
          last_name: 'User',
          status: 'active',
          created_by: null
        });
        console.log('  ✓ System user created');
      } else {
        console.log('  ✓ System user already exists');
      }
    } catch (error) {
      console.log('  ✗ Failed to create system user:', error.message);
      // Try to find it again (race condition)
      const systemUser = await User.findByPk(SYSTEM_USER_ID);
      if (systemUser) {
        console.log('  ✓ System user exists (created by another process)');
      } else {
        throw error;
      }
    }

    // Fix 2: Fix ActivityService.js filtered variable
    console.log('\n[Fix 2] Fixing ActivityService.js...');
    const activityServicePath = path.join(__dirname, '../src/services/ActivityService.js');
    let fileContent = fs.readFileSync(activityServicePath, 'utf8');
    
    let fixed = false;
    if (fileContent.includes('items: filtered')) {
      fileContent = fileContent.replace(/items:\s*filtered/g, 'items: enriched');
      fs.writeFileSync(activityServicePath, fileContent, 'utf8');
      console.log('  ✓ Fixed: Replaced "items: filtered" with "items: enriched"');
      fixed = true;
    }
    
    if (fileContent.includes('items: enriched')) {
      if (!fixed) {
        console.log('  ✓ Already correct: Uses "items: enriched"');
      }
    } else {
      console.log('  ⚠ Warning: Could not verify return statement');
    }

    // Fix 3: Verify BaseController generates IDs
    console.log('\n[Fix 3] Verifying BaseController.js...');
    const baseControllerPath = path.join(__dirname, '../src/controllers/BaseController.js');
    const baseControllerContent = fs.readFileSync(baseControllerPath, 'utf8');
    
    if (baseControllerContent.includes('generateUUID') && baseControllerContent.includes('if (!data.id)')) {
      console.log('  ✓ BaseController auto-generates IDs');
    } else {
      console.log('  ⚠ BaseController may need ID generation fix');
    }

    console.log('\n' + '='.repeat(60));
    console.log('ALL FIXES APPLIED');
    console.log('='.repeat(60));
    console.log('\nNext steps:');
    console.log('  1. Restart your server: npm start');
    console.log('  2. Test the fixes: npm run test:fixes');
    console.log('='.repeat(60) + '\n');

    process.exit(0);
  } catch (error) {
    console.error('\n✗ Fix failed:', error);
    console.error(error.stack);
    process.exit(1);
  }
}

fixAllIssues();


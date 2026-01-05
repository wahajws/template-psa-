require('dotenv').config();
const { sequelize } = require('../src/models');
const { User } = require('../src/models');
const fs = require('fs');
const path = require('path');

const SYSTEM_USER_ID = '00000000-0000-0000-0000-000000000000';

async function verifyStartup() {
  const errors = [];
  const warnings = [];

  try {
    console.log('Verifying startup requirements...\n');

    // Check 1: Database connection
    try {
      await sequelize.authenticate();
      console.log('✓ Database connection: OK');
    } catch (error) {
      errors.push('Database connection failed: ' + error.message);
      console.log('✗ Database connection: FAILED');
    }

    // Check 2: System user exists
    try {
      const systemUser = await User.findByPk(SYSTEM_USER_ID);
      if (!systemUser) {
        console.log('⚠ System user: MISSING (will be created on startup)');
        warnings.push('System user does not exist');
      } else {
        console.log('✓ System user: EXISTS');
      }
    } catch (error) {
      errors.push('Could not check system user: ' + error.message);
      console.log('✗ System user check: FAILED');
    }

    // Check 3: ActivityService.js doesn't have 'filtered' variable
    try {
      const activityServicePath = path.join(__dirname, '../src/services/ActivityService.js');
      const fileContent = fs.readFileSync(activityServicePath, 'utf8');
      
      if (fileContent.includes('items: filtered')) {
        errors.push('ActivityService.js still contains "items: filtered"');
        console.log('✗ ActivityService.js: CONTAINS ERROR (items: filtered)');
        
        // Auto-fix it
        console.log('  Attempting to fix...');
        const fixedContent = fileContent.replace(/items:\s*filtered/g, 'items: enriched');
        fs.writeFileSync(activityServicePath, fixedContent, 'utf8');
        console.log('  ✓ Fixed: Replaced "filtered" with "enriched"');
      } else if (fileContent.includes('items: enriched')) {
        console.log('✓ ActivityService.js: CORRECT (uses "enriched")');
      } else {
        warnings.push('Could not verify ActivityService.js return statement');
        console.log('⚠ ActivityService.js: COULD NOT VERIFY');
      }
    } catch (error) {
      errors.push('Could not check ActivityService.js: ' + error.message);
      console.log('✗ ActivityService.js check: FAILED');
    }

    // Check 4: BaseController generates IDs
    try {
      const baseControllerPath = path.join(__dirname, '../src/controllers/BaseController.js');
      const fileContent = fs.readFileSync(baseControllerPath, 'utf8');
      
      if (fileContent.includes('generateUUID') && fileContent.includes('if (!data.id)')) {
        console.log('✓ BaseController.js: AUTO-GENERATES IDs');
      } else {
        warnings.push('BaseController.js may not auto-generate IDs');
        console.log('⚠ BaseController.js: ID GENERATION UNCERTAIN');
      }
    } catch (error) {
      warnings.push('Could not check BaseController.js: ' + error.message);
      console.log('⚠ BaseController.js check: SKIPPED');
    }

    console.log('\n' + '='.repeat(60));
    if (errors.length > 0) {
      console.log('✗ VERIFICATION FAILED');
      console.log('\nErrors:');
      errors.forEach(err => console.log('  - ' + err));
      if (warnings.length > 0) {
        console.log('\nWarnings:');
        warnings.forEach(warn => console.log('  - ' + warn));
      }
      process.exit(1);
    } else {
      console.log('✓ VERIFICATION PASSED');
      if (warnings.length > 0) {
        console.log('\nWarnings:');
        warnings.forEach(warn => console.log('  - ' + warn));
      }
      console.log('\nServer is ready to start!');
      process.exit(0);
    }
  } catch (error) {
    console.error('\n✗ Verification error:', error);
    console.error(error.stack);
    process.exit(1);
  }
}

verifyStartup();


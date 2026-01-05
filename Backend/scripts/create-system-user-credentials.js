require('dotenv').config();
const { sequelize } = require('../src/models');
const { User, AuthIdentity } = require('../src/models');
const { generateUUID } = require('../src/utils/uuid');
const bcrypt = require('bcryptjs');

const SYSTEM_USER_ID = '00000000-0000-0000-0000-000000000000';
const SYSTEM_USER_EMAIL = 'system@platform.com';
const SYSTEM_USER_PASSWORD = 'SystemUser123!'; // Change this to a secure password

async function createSystemUserCredentials() {
  try {
    await sequelize.authenticate();
    console.log('Database connected.\n');

    // Check if system user exists
    let systemUser = await User.findByPk(SYSTEM_USER_ID);
    if (!systemUser) {
      console.log('Creating system user...');
      systemUser = await User.create({
        id: SYSTEM_USER_ID,
        email: SYSTEM_USER_EMAIL,
        first_name: 'System',
        last_name: 'User',
        status: 'active',
        created_by: null
      });
      console.log('✓ System user created');
    } else {
      console.log('✓ System user already exists');
    }

    // Check if AuthIdentity exists
    let authIdentity = await AuthIdentity.findOne({
      where: {
        user_id: SYSTEM_USER_ID,
        provider: 'email_password'
      }
    });

    if (!authIdentity) {
      console.log('\nCreating authentication credentials...');
      const passwordHash = await bcrypt.hash(SYSTEM_USER_PASSWORD, 10);
      
      authIdentity = await AuthIdentity.create({
        id: generateUUID(),
        user_id: SYSTEM_USER_ID,
        provider: 'email_password',
        provider_user_id: SYSTEM_USER_EMAIL,
        email: SYSTEM_USER_EMAIL,
        is_primary: true,
        verified_at: new Date(),
        provider_metadata: { password_hash: passwordHash }
      });
      console.log('✓ Authentication credentials created');
    } else {
      console.log('\n⚠ Authentication credentials already exist');
      console.log('  Updating password...');
      const passwordHash = await bcrypt.hash(SYSTEM_USER_PASSWORD, 10);
      await authIdentity.update({
        provider_metadata: { password_hash: passwordHash }
      });
      console.log('✓ Password updated');
    }

    console.log('\n' + '='.repeat(60));
    console.log('SYSTEM USER CREDENTIALS');
    console.log('='.repeat(60));
    console.log(`Email: ${SYSTEM_USER_EMAIL}`);
    console.log(`Password: ${SYSTEM_USER_PASSWORD}`);
    console.log('\n⚠ WARNING: The system user is meant for internal use only.');
    console.log('  It should NOT be used for regular login.');
    console.log('  It is used as a fallback for activity logging.');
    console.log('='.repeat(60) + '\n');

    process.exit(0);
  } catch (error) {
    console.error('Error creating system user credentials:', error);
    console.error(error.stack);
    process.exit(1);
  }
}

createSystemUserCredentials();


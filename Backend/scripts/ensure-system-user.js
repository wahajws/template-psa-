require('dotenv').config();
const { sequelize } = require('../src/models');
const { User } = require('../src/models');

const SYSTEM_USER_ID = '00000000-0000-0000-0000-000000000000';

async function ensureSystemUser() {
  try {
    await sequelize.authenticate();
    console.log('Database connected. Checking system user...\n');

    let systemUser = await User.findByPk(SYSTEM_USER_ID);
    if (!systemUser) {
      console.log('Creating system user...');
      systemUser = await User.create({
        id: SYSTEM_USER_ID,
        email: 'system@platform.com',
        first_name: 'System',
        last_name: 'User',
        status: 'active',
        created_by: null // System user doesn't have a creator
      });
      console.log('✓ System User created successfully');
    } else {
      console.log('✓ System User already exists');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error ensuring system user:', error);
    console.error(error.stack);
    process.exit(1);
  }
}

ensureSystemUser();


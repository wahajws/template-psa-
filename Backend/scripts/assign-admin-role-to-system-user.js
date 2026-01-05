require('dotenv').config();
const { sequelize } = require('../src/models');
const { User, Role, UserRole } = require('../src/models');
const { generateUUID } = require('../src/utils/uuid');

const SYSTEM_USER_ID = '00000000-0000-0000-0000-000000000000';

async function assignAdminRole() {
  try {
    await sequelize.authenticate();
    console.log('Database connected.\n');

    // Get system user
    const systemUser = await User.findByPk(SYSTEM_USER_ID);
    if (!systemUser) {
      console.log('✗ System user does not exist. Please run: npm run ensure-system-user');
      process.exit(1);
    }
    console.log('✓ System user found');

    // Get platform admin role
    const platformAdminRole = await Role.findOne({
      where: { role_type: 'platform_super_admin' }
    });

    if (!platformAdminRole) {
      console.log('✗ Platform admin role does not exist. Please run: npm run seed');
      process.exit(1);
    }
    console.log('✓ Platform admin role found');

    // Check if system user already has the role
    const existingRole = await UserRole.findOne({
      where: {
        user_id: SYSTEM_USER_ID,
        role_id: platformAdminRole.id
      }
    });

    if (existingRole) {
      console.log('✓ System user already has platform admin role');
    } else {
      // Assign platform admin role to system user
      await UserRole.create({
        id: generateUUID(),
        user_id: SYSTEM_USER_ID,
        role_id: platformAdminRole.id,
        company_id: null,
        branch_id: null,
        assigned_by: SYSTEM_USER_ID
      });
      console.log('✓ Platform admin role assigned to system user');
    }

    console.log('\n' + '='.repeat(60));
    console.log('SYSTEM USER NOW HAS ADMIN ACCESS');
    console.log('='.repeat(60));
    console.log('You can now:');
    console.log('  1. Log in as: system@platform.com');
    console.log('  2. Access: http://localhost:3001/admin/dashboard');
    console.log('  3. Use all admin CRUD operations');
    console.log('='.repeat(60) + '\n');

    process.exit(0);
  } catch (error) {
    console.error('Error assigning admin role:', error);
    console.error(error.stack);
    process.exit(1);
  }
}

assignAdminRole();


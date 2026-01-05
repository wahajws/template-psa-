require('dotenv').config();
const { sequelize } = require('../src/models');
const {
  Role, Permission, RolePermission, User, UserRole, AuthIdentity,
  Company, Branch, BranchContact, BranchBusinessHours, Court, Service,
  MembershipPlan, MembershipPlanBenefit, CompanyCustomer, Booking, BookingItem,
  Payment, Review, SupportTicket
} = require('../src/models');
const { generateUUID } = require('../src/utils/uuid');
const bcrypt = require('bcryptjs');

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('Database connected. Seeding data...\n');

    // ============================================================================
    // 1. ROLES
    // ============================================================================
    console.log('Creating roles...');
    const roles = {
      platformAdmin: await Role.findOrCreate({
        where: { role_type: 'platform_super_admin' },
        defaults: {
          id: generateUUID(),
          name: 'Platform Super Admin',
          role_type: 'platform_super_admin',
          description: 'Full platform access',
          is_system_role: true
        }
      }),
      companyAdmin: await Role.findOrCreate({
        where: { role_type: 'company_admin' },
        defaults: {
          id: generateUUID(),
          name: 'Company Admin',
          role_type: 'company_admin',
          description: 'Company management access',
          is_system_role: true
        }
      }),
      branchManager: await Role.findOrCreate({
        where: { role_type: 'branch_manager' },
        defaults: {
          id: generateUUID(),
          name: 'Branch Manager',
          role_type: 'branch_manager',
          description: 'Branch management access',
          is_system_role: true
        }
      }),
      branchStaff: await Role.findOrCreate({
        where: { role_type: 'branch_staff' },
        defaults: {
          id: generateUUID(),
          name: 'Branch Staff',
          role_type: 'branch_staff',
          description: 'Branch staff access',
          is_system_role: true
        }
      }),
      customer: await Role.findOrCreate({
        where: { role_type: 'customer' },
        defaults: {
          id: generateUUID(),
          name: 'Customer',
          role_type: 'customer',
          description: 'Customer access',
          is_system_role: true
        }
      })
    };

    const platformAdminRole = roles.platformAdmin[0];
    const companyAdminRole = roles.companyAdmin[0];
    const branchManagerRole = roles.branchManager[0];
    const customerRole = roles.customer[0];

    // ============================================================================
    // 2. SYSTEM USER (for anonymous activity logging)
    // ============================================================================
    const SYSTEM_USER_ID = '00000000-0000-0000-0000-000000000000';
    let systemUser = await User.findByPk(SYSTEM_USER_ID);
    if (!systemUser) {
      systemUser = await User.create({
        id: SYSTEM_USER_ID,
        email: 'system@platform.com',
        first_name: 'System',
        last_name: 'User',
        status: 'active',
        created_by: SYSTEM_USER_ID
      });
      console.log('  ✓ System User created for activity logging');
    }

    // ============================================================================
    // 3. USERS
    // ============================================================================
    console.log('Creating users...');

    // Platform Admin
    let platformAdmin = await User.findOne({ where: { email: 'admin@platform.com' } });
    if (!platformAdmin) {
      const adminId = generateUUID();
      const adminPasswordHash = await bcrypt.hash('Admin123!', 10);
      
      platformAdmin = await User.create({
        id: adminId,
        email: 'admin@platform.com',
        first_name: 'Platform',
        last_name: 'Admin',
        status: 'active',
        email_verified_at: new Date(),
        created_by: adminId
      });

      await AuthIdentity.create({
        id: generateUUID(),
        user_id: adminId,
        provider: 'email_password',
        provider_user_id: 'admin@platform.com',
        email: 'admin@platform.com',
        is_primary: true,
        verified_at: new Date(),
        provider_metadata: { password_hash: adminPasswordHash }
      });

      await UserRole.create({
        id: generateUUID(),
        user_id: adminId,
        role_id: platformAdminRole.id,
        company_id: null,
        branch_id: null,
        assigned_by: adminId
      });

      console.log('  ✓ Platform Admin: admin@platform.com / Admin123!');
    }

    // Company Admin
    let companyAdmin = await User.findOne({ where: { email: 'company@admin.com' } });
    if (!companyAdmin) {
      const companyAdminId = generateUUID();
      const companyAdminPasswordHash = await bcrypt.hash('Company123!', 10);
      
      companyAdmin = await User.create({
        id: companyAdminId,
        email: 'company@admin.com',
        first_name: 'Company',
        last_name: 'Admin',
        status: 'active',
        email_verified_at: new Date(),
        created_by: platformAdmin.id
      });

      await AuthIdentity.create({
        id: generateUUID(),
        user_id: companyAdminId,
        provider: 'email_password',
        provider_user_id: 'company@admin.com',
        email: 'company@admin.com',
        is_primary: true,
        verified_at: new Date(),
        provider_metadata: { password_hash: companyAdminPasswordHash }
      });

      console.log('  ✓ Company Admin: company@admin.com / Company123!');
    }

    // Branch Manager
    let branchManager = await User.findOne({ where: { email: 'branch@manager.com' } });
    if (!branchManager) {
      const branchManagerId = generateUUID();
      const branchManagerPasswordHash = await bcrypt.hash('Branch123!', 10);
      
      branchManager = await User.create({
        id: branchManagerId,
        email: 'branch@manager.com',
        first_name: 'Branch',
        last_name: 'Manager',
        status: 'active',
        email_verified_at: new Date(),
        created_by: platformAdmin.id
      });

      await AuthIdentity.create({
        id: generateUUID(),
        user_id: branchManagerId,
        provider: 'email_password',
        provider_user_id: 'branch@manager.com',
        email: 'branch@manager.com',
        is_primary: true,
        verified_at: new Date(),
        provider_metadata: { password_hash: branchManagerPasswordHash }
      });

      console.log('  ✓ Branch Manager: branch@manager.com / Branch123!');
    }

    // Test Customers
    const customers = [];
    for (let i = 1; i <= 3; i++) {
      let customer = await User.findOne({ where: { email: `customer${i}@test.com` } });
      if (!customer) {
        const customerId = generateUUID();
        const customerPasswordHash = await bcrypt.hash('Customer123!', 10);
        
        customer = await User.create({
          id: customerId,
          email: `customer${i}@test.com`,
          first_name: `Customer${i}`,
          last_name: 'Test',
          phone: `+1234567890${i}`,
          status: 'active',
          email_verified_at: new Date(),
          created_by: platformAdmin.id
        });

        await AuthIdentity.create({
          id: generateUUID(),
          user_id: customerId,
          provider: 'email_password',
          provider_user_id: `customer${i}@test.com`,
          email: `customer${i}@test.com`,
          is_primary: true,
          verified_at: new Date(),
          provider_metadata: { password_hash: customerPasswordHash }
        });

        await UserRole.create({
          id: generateUUID(),
          user_id: customerId,
          role_id: customerRole.id,
          company_id: null,
          branch_id: null,
          assigned_by: platformAdmin.id
        });

        customers.push(customer);
        console.log(`  ✓ Customer ${i}: customer${i}@test.com / Customer123!`);
      } else {
        customers.push(customer);
      }
    }

    // ============================================================================
    // 3. COMPANIES
    // ============================================================================
    console.log('\nCreating companies...');
    let company1 = await Company.findOne({ where: { name: 'Pickleball Paradise' } });
    if (!company1) {
      company1 = await Company.create({
        id: generateUUID(),
        name: 'Pickleball Paradise',
        slug: 'pickleball-paradise',
        description: 'Premier pickleball facility in San Francisco',
        website_url: 'https://pickleballparadise.com',
        timezone: 'America/Los_Angeles',
        default_currency: 'USD',
        status: 'active',
        created_by: platformAdmin.id
      });
      console.log('  ✓ Company: Pickleball Paradise');
    }

    let company2 = await Company.findOne({ where: { name: 'Court Masters' } });
    if (!company2) {
      company2 = await Company.create({
        id: generateUUID(),
        name: 'Court Masters',
        slug: 'court-masters',
        description: 'Professional court rental services',
        website_url: 'https://courtmasters.com',
        timezone: 'America/Los_Angeles',
        default_currency: 'USD',
        status: 'active',
        created_by: platformAdmin.id
      });
      console.log('  ✓ Company: Court Masters');
    }

    // Assign company admin role
    if (companyAdmin && !await UserRole.findOne({ where: { user_id: companyAdmin.id, company_id: company1.id } })) {
      await UserRole.create({
        id: generateUUID(),
        user_id: companyAdmin.id,
        role_id: companyAdminRole.id,
        company_id: company1.id,
        branch_id: null,
        assigned_by: platformAdmin.id
      });
    }

    // ============================================================================
    // 4. BRANCHES
    // ============================================================================
    console.log('\nCreating branches...');
    let branch1 = await Branch.findOne({ where: { company_id: company1.id, name: 'Downtown Branch' } });
    if (!branch1) {
      branch1 = await Branch.create({
        id: generateUUID(),
        company_id: company1.id,
        name: 'Downtown Branch',
        slug: 'downtown-branch',
        address_line1: '789 Main St',
        city: 'San Francisco',
        state: 'CA',
        country: 'US',
        postal_code: '94103',
        latitude: 37.7749,
        longitude: -122.4194,
        timezone: 'America/Los_Angeles',
        status: 'active',
        created_by: companyAdmin.id
      });
      console.log('  ✓ Branch: Downtown Branch');

      // Branch Contact
      await BranchContact.create({
        id: generateUUID(),
        branch_id: branch1.id,
        contact_type: 'phone',
        contact_value: '+1-555-1001',
        is_primary: true,
        created_by: companyAdmin.id
      });

      await BranchContact.create({
        id: generateUUID(),
        branch_id: branch1.id,
        contact_type: 'email',
        contact_value: 'downtown@pickleballparadise.com',
        is_primary: false,
        created_by: companyAdmin.id
      });

      // Business Hours (Monday-Sunday, 6 AM - 10 PM)
      // day_of_week: 0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday
      for (let day = 0; day <= 6; day++) {
        await BranchBusinessHours.create({
          id: generateUUID(),
          branch_id: branch1.id,
          day_of_week: day,
          open_time: '06:00:00',
          close_time: '22:00:00',
          is_closed: false,
          created_by: companyAdmin.id
        });
      }
    }

    let branch2 = await Branch.findOne({ where: { company_id: company1.id, name: 'Westside Branch' } });
    if (!branch2) {
      branch2 = await Branch.create({
        id: generateUUID(),
        company_id: company1.id,
        name: 'Westside Branch',
        slug: 'westside-branch',
        address_line1: '321 Ocean Blvd',
        city: 'San Francisco',
        state: 'CA',
        country: 'US',
        postal_code: '94117',
        latitude: 37.7849,
        longitude: -122.4094,
        timezone: 'America/Los_Angeles',
        status: 'active',
        created_by: companyAdmin.id
      });
      console.log('  ✓ Branch: Westside Branch');

      // Business Hours
      // day_of_week: 0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday
      for (let day = 0; day <= 6; day++) {
        await BranchBusinessHours.create({
          id: generateUUID(),
          branch_id: branch2.id,
          day_of_week: day,
          open_time: '07:00:00',
          close_time: '21:00:00',
          is_closed: false,
          created_by: companyAdmin.id
        });
      }
    }

    // Assign branch manager
    if (branchManager && !await UserRole.findOne({ where: { user_id: branchManager.id, branch_id: branch1.id } })) {
      await UserRole.create({
        id: generateUUID(),
        user_id: branchManager.id,
        role_id: branchManagerRole.id,
        company_id: company1.id,
        branch_id: branch1.id,
        assigned_by: companyAdmin.id
      });
    }

    // ============================================================================
    // 5. COURTS
    // ============================================================================
    console.log('\nCreating courts...');
    const courts = [];
    for (let i = 1; i <= 4; i++) {
      let court = await Court.findOne({ where: { branch_id: branch1.id, court_number: i.toString() } });
      if (!court) {
        court = await Court.create({
          id: generateUUID(),
          branch_id: branch1.id,
          name: `Court ${i}`,
          court_number: i.toString(),
          status: 'active',
          surface_type: i % 2 === 0 ? 'indoor' : 'outdoor',
          hourly_rate: 25.00 + (i * 5),
          description: `Court ${i} description`,
          created_by: companyAdmin.id
        });
        courts.push(court);
        console.log(`  ✓ Court ${i}: ${court.name} ($${court.hourly_rate}/hr)`);
      } else {
        courts.push(court);
      }
    }

    // ============================================================================
    // 6. SERVICES
    // ============================================================================
    console.log('\nCreating services...');
    let service1 = await Service.findOne({ where: { company_id: company1.id, name: 'Court Rental' } });
    if (!service1) {
      service1 = await Service.create({
        id: generateUUID(),
        company_id: company1.id,
        name: 'Court Rental',
        description: 'Standard court rental service',
        service_type: 'court_booking',
        base_price: 30.00,
        currency: 'USD',
        is_active: true,
        created_by: companyAdmin.id
      });
      console.log('  ✓ Service: Court Rental');
    }

    let service2 = await Service.findOne({ where: { company_id: company1.id, name: 'Equipment Rental' } });
    if (!service2) {
      service2 = await Service.create({
        id: generateUUID(),
        company_id: company1.id,
        name: 'Equipment Rental',
        description: 'Paddles and balls rental',
        service_type: 'equipment_rental',
        base_price: 10.00,
        currency: 'USD',
        is_active: true,
        created_by: companyAdmin.id
      });
      console.log('  ✓ Service: Equipment Rental');
    }

    // ============================================================================
    // 7. MEMBERSHIP PLANS
    // ============================================================================
    console.log('\nCreating membership plans...');
    let plan1 = await MembershipPlan.findOne({ where: { company_id: company1.id, name: 'Monthly Unlimited' } });
    if (!plan1 && service1) {
      plan1 = await MembershipPlan.create({
        id: generateUUID(),
        company_id: company1.id,
        service_id: service1.id,
        name: 'Monthly Unlimited',
        description: 'Unlimited court access for one month',
        plan_type: 'recurring',
        plan_scope: 'company_wide',
        price: 99.99,
        billing_type: 'monthly',
        currency: 'USD',
        max_active_per_user: 1,
        is_active: true,
        created_by: companyAdmin.id
      });

      await MembershipPlanBenefit.create({
        id: generateUUID(),
        membership_plan_id: plan1.id,
        benefit_type: 'discount',
        benefit_value: 20.00,
        description: '20% off all bookings',
        created_by: companyAdmin.id
      });

      console.log('  ✓ Plan: Monthly Unlimited ($99.99/month)');
    }

    let plan2 = await MembershipPlan.findOne({ where: { company_id: company1.id, name: '10-Session Pass' } });
    if (!plan2 && service1) {
      plan2 = await MembershipPlan.create({
        id: generateUUID(),
        company_id: company1.id,
        service_id: service1.id,
        name: '10-Session Pass',
        description: 'Prepaid pass for 10 sessions',
        plan_type: 'prepaid_pass',
        plan_scope: 'company_wide',
        price: 200.00,
        billing_type: 'prepaid_passes',
        currency: 'USD',
        max_active_per_user: 1,
        is_active: true,
        created_by: companyAdmin.id
      });
      console.log('  ✓ Plan: 10-Session Pass ($200.00)');
    }

    // ============================================================================
    // 8. COMPANY CUSTOMERS (Subscriptions)
    // ============================================================================
    console.log('\nCreating company subscriptions...');
    if (customers.length > 0 && !await CompanyCustomer.findOne({ where: { user_id: customers[0].id, company_id: company1.id } })) {
      await CompanyCustomer.create({
        id: generateUUID(),
        user_id: customers[0].id,
        company_id: company1.id,
        default_branch_id: branch1.id,
        status: 'active',
        marketing_opt_in: true,
        created_by: customers[0].id
      });
      console.log('  ✓ Customer 1 subscribed to Pickleball Paradise');
    }

    // ============================================================================
    // 9. BOOKINGS
    // ============================================================================
    console.log('\nCreating sample bookings...');
    if (customers.length > 0 && courts.length > 0 && service1) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(10, 0, 0, 0);
      
      const endTime = new Date(tomorrow);
      endTime.setHours(11, 0, 0, 0);

      let booking = await Booking.findOne({ where: { user_id: customers[0].id, company_id: company1.id } });
      if (!booking) {
        const bookingNumber = `BK-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        booking = await Booking.create({
          id: generateUUID(),
          booking_number: bookingNumber,
          user_id: customers[0].id,
          company_id: company1.id,
          branch_id: branch1.id,
          status: 'confirmed',
          booking_source: 'customer_web',
          subtotal: 30.00,
          total_amount: 30.00,
          created_by: customers[0].id
        });

        const durationMinutes = Math.round((endTime - tomorrow) / (1000 * 60));
        await BookingItem.create({
          id: generateUUID(),
          booking_id: booking.id,
          company_id: company1.id,
          branch_id: branch1.id,
          court_id: courts[0].id,
          service_id: service1.id,
          start_datetime: tomorrow,
          end_datetime: endTime,
          duration_minutes: durationMinutes,
          quantity: 1,
          unit_price: 30.00,
          subtotal: 30.00,
          total_amount: 30.00,
          created_by: customers[0].id
        });

        console.log('  ✓ Sample booking created for tomorrow 10-11 AM');
      }
    }

    // ============================================================================
    // 10. REVIEWS
    // ============================================================================
    console.log('\nCreating sample reviews...');
    if (customers.length > 0 && company1) {
      let review = await Review.findOne({ where: { user_id: customers[0].id, company_id: company1.id } });
      if (!review) {
        await Review.create({
          id: generateUUID(),
          user_id: customers[0].id,
          company_id: company1.id,
          branch_id: branch1.id,
          rating: 5,
          title: 'Great experience!',
          comment: 'The courts are well-maintained and the staff is friendly.',
          status: 'approved',
          created_by: customers[0].id
        });
        console.log('  ✓ Sample review created');
      }
    }

    // ============================================================================
    // SUMMARY
    // ============================================================================
    console.log('\n' + '='.repeat(60));
    console.log('SEED COMPLETED SUCCESSFULLY!');
    console.log('='.repeat(60));
    console.log('\nTest Credentials:');
    console.log('  Platform Admin: admin@platform.com / Admin123!');
    console.log('  Company Admin:  company@admin.com / Company123!');
    console.log('  Branch Manager:  branch@manager.com / Branch123!');
    console.log('  Customer 1:      customer1@test.com / Customer123!');
    console.log('  Customer 2:      customer2@test.com / Customer123!');
    console.log('  Customer 3:      customer3@test.com / Customer123!');
    console.log('\nTest Data:');
    console.log(`  Companies: 2 (Pickleball Paradise, Court Masters)`);
    console.log(`  Branches: 2 (Downtown, Westside)`);
    console.log(`  Courts: ${courts.length} (in Downtown Branch)`);
    console.log(`  Services: 2 (Court Rental, Equipment Rental)`);
    console.log(`  Membership Plans: 2 (Monthly Unlimited, 10-Session Pass)`);
    console.log('='.repeat(60) + '\n');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    console.error(error.stack);
    process.exit(1);
  }
}

seed();

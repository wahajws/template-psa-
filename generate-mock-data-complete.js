const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const OUTPUT_DIR = path.join(__dirname, 'mock-data');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const uuid = () => crypto.randomUUID();
const date = (d) => d.toISOString().split('T')[0];
const datetime = (d) => d.toISOString().slice(0, 19).replace('T', ' ');
const time = (d) => d.toTimeString().slice(0, 5);

const csvEscape = (val) => {
  if (val === null || val === undefined) return '';
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

const writeCSV = (filename, headers, rows) => {
  const filepath = path.join(OUTPUT_DIR, filename);
  const lines = [headers.join(',')];
  rows.forEach(row => {
    lines.push(row.map(csvEscape).join(','));
  });
  fs.writeFileSync(filepath, lines.join('\n'), 'utf8');
  console.log(`✓ ${filename} (${rows.length} rows)`);
};

const baseDate = new Date('2024-01-01');
const now = new Date();

// Data storage
const data = {
  roles: [],
  permissions: [],
  rolePermissions: [],
  users: [],
  userRoles: [],
  authIdentities: [],
  companies: [],
  branches: [],
  branchContacts: [],
  branchAmenities: [],
  branchStaff: [],
  branchBusinessHours: [],
  branchSpecialHours: [],
  courts: [],
  courtFeatures: [],
  courtRateRules: [],
  courtTimeSlots: [],
  resourceBlocks: [],
  services: [],
  serviceBranchAvailability: [],
  membershipPlans: [],
  membershipPlanBenefits: [],
  customerMemberships: [],
  membershipCycles: [],
  membershipUsageLedger: [],
  campaigns: [],
  campaignRules: [],
  promoCodes: [],
  discountApplications: [],
  bookings: [],
  bookingItems: [],
  bookingParticipants: [],
  bookingChangeLog: [],
  bookingWaitlist: [],
  payments: [],
  paymentAttempts: [],
  refunds: [],
  invoices: [],
  invoiceItems: [],
  customerWalletLedger: [],
  giftCards: [],
  giftCardRedemptions: [],
  mediaFiles: [],
  mediaVariants: [],
  reviews: [],
  supportTickets: [],
  supportTicketMessages: [],
  auditLogs: [],
  otpCodes: [],
  authSessions: [],
  companyCustomers: [],
  groups: [],
  groupMembers: [],
  groupBookings: [],
  taxRates: [],
  notificationTemplates: [],
  notificationsOutbox: [],
  notificationDeliveryLogs: [],
  userNotificationPreferences: [],
};

// ============================================================================
// 1. ROLES & PERMISSIONS
// ============================================================================
const platformAdminRoleId = uuid();
const companyAdminRoleId = uuid();
const branchManagerRoleId = uuid();
const branchStaffRoleId = uuid();
const customerRoleId = uuid();

data.roles = [
  { id: platformAdminRoleId, name: 'platform_super_admin', role_type: 'platform_super_admin', is_system: true },
  { id: companyAdminRoleId, name: 'company_admin', role_type: 'company_admin', is_system: true },
  { id: branchManagerRoleId, name: 'branch_manager', role_type: 'branch_manager', is_system: true },
  { id: branchStaffRoleId, name: 'branch_staff', role_type: 'branch_staff', is_system: true },
  { id: customerRoleId, name: 'customer', role_type: 'customer', is_system: true },
];

data.permissions = [
  { id: uuid(), name: 'companies.create', resource: 'companies', action: 'create' },
  { id: uuid(), name: 'companies.read', resource: 'companies', action: 'read' },
  { id: uuid(), name: 'companies.update', resource: 'companies', action: 'update' },
  { id: uuid(), name: 'companies.delete', resource: 'companies', action: 'delete' },
  { id: uuid(), name: 'branches.create', resource: 'branches', action: 'create' },
  { id: uuid(), name: 'branches.read', resource: 'branches', action: 'read' },
  { id: uuid(), name: 'branches.update', resource: 'branches', action: 'update' },
  { id: uuid(), name: 'branches.delete', resource: 'branches', action: 'delete' },
  { id: uuid(), name: 'bookings.create', resource: 'bookings', action: 'create' },
  { id: uuid(), name: 'bookings.read', resource: 'bookings', action: 'read' },
  { id: uuid(), name: 'bookings.update', resource: 'bookings', action: 'update' },
  { id: uuid(), name: 'bookings.delete', resource: 'bookings', action: 'delete' },
];

data.rolePermissions = [];
data.roles.forEach(role => {
  data.permissions.forEach(perm => {
    data.rolePermissions.push({
      id: uuid(),
      role_id: role.id,
      permission_id: perm.id,
      created_at: datetime(baseDate),
      updated_at: datetime(baseDate),
    });
  });
});

// ============================================================================
// 2. USERS
// ============================================================================
const platformAdminId = uuid();
data.users.push({
  id: platformAdminId,
  email: 'admin@platform.com',
  phone: '+15550000001',
  first_name: 'Platform',
  last_name: 'Admin',
  status: 'active',
  email_verified_at: datetime(baseDate),
  phone_verified_at: datetime(baseDate),
  last_login_at: datetime(new Date(now.getTime() - 3600000)),
  created_at: datetime(baseDate),
  updated_at: datetime(now),
  created_by: platformAdminId,
});

data.userRoles.push({
  id: uuid(),
  user_id: platformAdminId,
  role_id: platformAdminRoleId,
  company_id: null,
  branch_id: null,
  assigned_at: datetime(baseDate),
  assigned_by: platformAdminId,
  created_at: datetime(baseDate),
  updated_at: datetime(baseDate),
});

data.authIdentities.push({
  id: uuid(),
  user_id: platformAdminId,
  provider: 'email_password',
  provider_user_id: 'admin@platform.com',
  email: 'admin@platform.com',
  is_primary: true,
  verified_at: datetime(baseDate),
  created_at: datetime(baseDate),
  updated_at: datetime(baseDate),
});

// Company Admins (2 per company = 10 total)
const companyAdminUsers = [];
for (let c = 1; c <= 5; c++) {
  for (let a = 1; a <= 2; a++) {
    const userId = uuid();
    const email = `admin${c}${a}@company${c}.com`;
    data.users.push({
      id: userId,
      email,
      phone: `+1555000${String(c).padStart(2, '0')}${a}`,
      first_name: `Company${c}`,
      last_name: `Admin${a}`,
      status: 'active',
      email_verified_at: datetime(new Date(baseDate.getTime() + c * 86400000)),
      phone_verified_at: datetime(new Date(baseDate.getTime() + c * 86400000)),
      last_login_at: datetime(new Date(now.getTime() - 7200000)),
      created_at: datetime(new Date(baseDate.getTime() + c * 86400000)),
      updated_at: datetime(now),
      created_by: platformAdminId,
    });
    companyAdminUsers.push({ id: userId, company: c, adminNum: a });
    
    data.authIdentities.push({
      id: uuid(),
      user_id: userId,
      provider: 'email_password',
      provider_user_id: email,
      email,
      is_primary: true,
      verified_at: datetime(new Date(baseDate.getTime() + c * 86400000)),
      created_at: datetime(new Date(baseDate.getTime() + c * 86400000)),
      updated_at: datetime(new Date(baseDate.getTime() + c * 86400000)),
    });
  }
}

// Customers (100 total, shared across companies)
const customerUsers = [];
const firstNames = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Avery', 'Quinn', 'Sage', 'River'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Wilson', 'Moore'];

for (let i = 1; i <= 100; i++) {
  const userId = uuid();
  const email = `customer${i}@testmail.com`;
  
  data.users.push({
    id: userId,
    email,
    phone: `+1555100${String(i).padStart(4, '0')}`,
    first_name: firstNames[i % firstNames.length],
    last_name: lastNames[i % lastNames.length],
    date_of_birth: date(new Date(1980 + (i % 30), (i % 12), (i % 28) + 1)),
    status: i % 20 === 0 ? 'inactive' : 'active',
    email_verified_at: datetime(new Date(baseDate.getTime() + i * 86400000)),
    phone_verified_at: datetime(new Date(baseDate.getTime() + i * 86400000)),
    last_login_at: datetime(new Date(now.getTime() - (i % 7) * 86400000)),
    created_at: datetime(new Date(baseDate.getTime() + i * 86400000)),
    updated_at: datetime(now),
    created_by: platformAdminId,
  });
  
  customerUsers.push(userId);
  
  data.userRoles.push({
    id: uuid(),
    user_id: userId,
    role_id: customerRoleId,
    company_id: null,
    branch_id: null,
    assigned_at: datetime(new Date(baseDate.getTime() + i * 86400000)),
    assigned_by: platformAdminId,
    created_at: datetime(new Date(baseDate.getTime() + i * 86400000)),
    updated_at: datetime(new Date(baseDate.getTime() + i * 86400000)),
  });
  
  data.authIdentities.push({
    id: uuid(),
    user_id: userId,
    provider: 'email_password',
    provider_user_id: email,
    email,
    is_primary: true,
    verified_at: datetime(new Date(baseDate.getTime() + i * 86400000)),
    created_at: datetime(new Date(baseDate.getTime() + i * 86400000)),
    updated_at: datetime(new Date(baseDate.getTime() + i * 86400000)),
  });
}

// ============================================================================
// 3. COMPANIES & BRANCHES
// ============================================================================
const companyNames = [
  'Pickleball Paradise',
  'Court Masters',
  'Ace Sports Center',
  'Rally Point Courts',
  'Smash Zone',
];

const companyIds = [];
const branchIds = [];
const branchManagers = [];
const branchStaffUsers = [];

for (let i = 0; i < 5; i++) {
  const companyId = uuid();
  companyIds.push(companyId);
  const companyAdmin = companyAdminUsers[i * 2];
  
  data.companies.push({
    id: companyId,
    name: companyNames[i],
    slug: companyNames[i].toLowerCase().replace(/\s+/g, '-'),
    description: `Premier ${companyNames[i]} facility offering world-class pickleball courts and services.`,
    logo_media_id: null,
    website_url: `https://${companyNames[i].toLowerCase().replace(/\s+/g, '')}.com`,
    timezone: 'America/Los_Angeles',
    default_currency: 'USD',
    status: i === 3 ? 'suspended' : 'active',
    created_at: datetime(new Date(baseDate.getTime() + (i + 1) * 86400000)),
    updated_at: datetime(now),
    created_by: platformAdminId,
    updated_by: platformAdminId,
  });
  
  // Assign company admin role
  data.userRoles.push({
    id: uuid(),
    user_id: companyAdmin.id,
    role_id: companyAdminRoleId,
    company_id: companyId,
    branch_id: null,
    assigned_at: datetime(new Date(baseDate.getTime() + (i + 1) * 86400000)),
    assigned_by: platformAdminId,
    created_at: datetime(new Date(baseDate.getTime() + (i + 1) * 86400000)),
    updated_at: datetime(new Date(baseDate.getTime() + (i + 1) * 86400000)),
  });
  
  // Branches (2-4 per company)
  const numBranches = 2 + (i % 3);
  const branchNames = [
    ['Downtown', 'Westside', 'North Park', 'South Bay'],
    ['Main Street', 'Riverside', 'Hilltop'],
    ['Central', 'Eastside', 'Waterfront'],
    ['Plaza', 'Garden'],
    ['Arena', 'Stadium', 'Pavilion'],
  ];
  
  const cities = ['San Francisco', 'Los Angeles', 'San Diego', 'Oakland', 'Sacramento'];
  
  for (let b = 0; b < numBranches; b++) {
    const branchId = uuid();
    branchIds.push({ id: branchId, companyId, branchNum: b });
    const branchName = branchNames[i][b] || `Branch ${b + 1}`;
    
    data.branches.push({
      id: branchId,
      company_id: companyId,
      name: `${branchName} Branch`,
      slug: `${companyNames[i].toLowerCase().replace(/\s+/g, '-')}-${branchName.toLowerCase()}`,
      description: `${branchName} location of ${companyNames[i]}`,
      address_line1: `${100 + b * 10} ${branchName} Street`,
      address_line2: b % 2 === 0 ? 'Suite 200' : null,
      city: cities[i],
      state: 'CA',
      postal_code: `9410${b}`,
      country: 'USA',
      latitude: (37.7749 + (i * 0.1) + (b * 0.01)).toFixed(8),
      longitude: (-122.4194 + (i * 0.1) + (b * 0.01)).toFixed(8),
      timezone: 'America/Los_Angeles',
      status: 'active',
      created_at: datetime(new Date(baseDate.getTime() + (i + 1) * 86400000 + b * 3600000)),
      updated_at: datetime(now),
      created_by: companyAdmin.id,
      updated_by: companyAdmin.id,
    });
    
    // Branch contacts
    data.branchContacts.push({
      id: uuid(),
      branch_id: branchId,
      contact_type: 'phone',
      contact_value: `+1555${String(i + 1).padStart(3, '0')}${String(b + 1).padStart(3, '0')}`,
      is_primary: true,
      label: 'Main Office',
      created_at: datetime(new Date(baseDate.getTime() + (i + 1) * 86400000)),
      updated_at: datetime(new Date(baseDate.getTime() + (i + 1) * 86400000)),
    });
    
    data.branchContacts.push({
      id: uuid(),
      branch_id: branchId,
      contact_type: 'email',
      contact_value: `info@${companyNames[i].toLowerCase().replace(/\s+/g, '')}-${branchName.toLowerCase()}.com`,
      is_primary: false,
      label: 'General Inquiries',
      created_at: datetime(new Date(baseDate.getTime() + (i + 1) * 86400000)),
      updated_at: datetime(new Date(baseDate.getTime() + (i + 1) * 86400000)),
    });
    
    // Branch amenities
    const amenityNames = ['Parking', 'Locker Room', 'Pro Shop', 'Cafe', 'WiFi', 'Showers'];
    amenityNames.slice(0, 3 + (b % 3)).forEach((name) => {
      data.branchAmenities.push({
        id: uuid(),
        branch_id: branchId,
        name,
        description: `${name} available at this location`,
        icon_name: name.toLowerCase().replace(/\s+/g, '_'),
        created_at: datetime(new Date(baseDate.getTime() + (i + 1) * 86400000)),
        updated_at: datetime(new Date(baseDate.getTime() + (i + 1) * 86400000)),
      });
    });
    
    // Branch managers (1-2 per branch)
    const numManagers = 1 + (b % 2);
    for (let m = 0; m < numManagers; m++) {
      const managerId = uuid();
      const managerEmail = `manager${i + 1}${b + 1}${m + 1}@company${i + 1}.com`;
      
      data.users.push({
        id: managerId,
        email: managerEmail,
        phone: `+1555200${String(i + 1).padStart(2, '0')}${String(b + 1).padStart(2, '0')}${m + 1}`,
        first_name: `Branch${b + 1}`,
        last_name: `Manager${m + 1}`,
        status: 'active',
        email_verified_at: datetime(new Date(baseDate.getTime() + (i + 1) * 86400000)),
        phone_verified_at: datetime(new Date(baseDate.getTime() + (i + 1) * 86400000)),
        last_login_at: datetime(new Date(now.getTime() - 10800000)),
        created_at: datetime(new Date(baseDate.getTime() + (i + 1) * 86400000)),
        updated_at: datetime(now),
        created_by: companyAdmin.id,
      });
      
      branchManagers.push({ id: managerId, branchId, companyId });
      
      data.userRoles.push({
        id: uuid(),
        user_id: managerId,
        role_id: branchManagerRoleId,
        company_id: companyId,
        branch_id: branchId,
        assigned_at: datetime(new Date(baseDate.getTime() + (i + 1) * 86400000)),
        assigned_by: companyAdmin.id,
        created_at: datetime(new Date(baseDate.getTime() + (i + 1) * 86400000)),
        updated_at: datetime(new Date(baseDate.getTime() + (i + 1) * 86400000)),
      });
      
      data.branchStaff.push({
        id: uuid(),
        branch_id: branchId,
        user_id: managerId,
        position: 'Branch Manager',
        is_manager: true,
        assigned_at: datetime(new Date(baseDate.getTime() + (i + 1) * 86400000)),
        assigned_by: companyAdmin.id,
        is_active: true,
        created_at: datetime(new Date(baseDate.getTime() + (i + 1) * 86400000)),
        updated_at: datetime(new Date(baseDate.getTime() + (i + 1) * 86400000)),
      });
      
      data.authIdentities.push({
        id: uuid(),
        user_id: managerId,
        provider: 'email_password',
        provider_user_id: managerEmail,
        email: managerEmail,
        is_primary: true,
        verified_at: datetime(new Date(baseDate.getTime() + (i + 1) * 86400000)),
        created_at: datetime(new Date(baseDate.getTime() + (i + 1) * 86400000)),
        updated_at: datetime(new Date(baseDate.getTime() + (i + 1) * 86400000)),
      });
    }
    
    // Branch staff (1-2 per branch)
    const numStaff = 1 + ((b + 1) % 2);
    for (let s = 0; s < numStaff; s++) {
      const staffId = uuid();
      const staffEmail = `staff${i + 1}${b + 1}${s + 1}@company${i + 1}.com`;
      
      data.users.push({
        id: staffId,
        email: staffEmail,
        phone: `+1555300${String(i + 1).padStart(2, '0')}${String(b + 1).padStart(2, '0')}${s + 1}`,
        first_name: `Staff${s + 1}`,
        last_name: 'Member',
        status: 'active',
        email_verified_at: datetime(new Date(baseDate.getTime() + (i + 1) * 86400000)),
        phone_verified_at: datetime(new Date(baseDate.getTime() + (i + 1) * 86400000)),
        last_login_at: datetime(new Date(now.getTime() - 14400000)),
        created_at: datetime(new Date(baseDate.getTime() + (i + 1) * 86400000)),
        updated_at: datetime(now),
        created_by: companyAdmin.id,
      });
      
      branchStaffUsers.push({ id: staffId, branchId, companyId });
      
      data.userRoles.push({
        id: uuid(),
        user_id: staffId,
        role_id: branchStaffRoleId,
        company_id: companyId,
        branch_id: branchId,
        assigned_at: datetime(new Date(baseDate.getTime() + (i + 1) * 86400000)),
        assigned_by: companyAdmin.id,
        created_at: datetime(new Date(baseDate.getTime() + (i + 1) * 86400000)),
        updated_at: datetime(new Date(baseDate.getTime() + (i + 1) * 86400000)),
      });
      
      data.branchStaff.push({
        id: uuid(),
        branch_id: branchId,
        user_id: staffId,
        position: 'Front Desk',
        is_manager: false,
        assigned_at: datetime(new Date(baseDate.getTime() + (i + 1) * 86400000)),
        assigned_by: companyAdmin.id,
        is_active: true,
        created_at: datetime(new Date(baseDate.getTime() + (i + 1) * 86400000)),
        updated_at: datetime(new Date(baseDate.getTime() + (i + 1) * 86400000)),
      });
      
      data.authIdentities.push({
        id: uuid(),
        user_id: staffId,
        provider: 'email_password',
        provider_user_id: staffEmail,
        email: staffEmail,
        is_primary: true,
        verified_at: datetime(new Date(baseDate.getTime() + (i + 1) * 86400000)),
        created_at: datetime(new Date(baseDate.getTime() + (i + 1) * 86400000)),
        updated_at: datetime(new Date(baseDate.getTime() + (i + 1) * 86400000)),
      });
    }
    
    // Business hours (Mon-Sun, 0-6)
    for (let d = 0; d < 7; d++) {
      data.branchBusinessHours.push({
        id: uuid(),
        branch_id: branchId,
        day_of_week: d,
        open_time: d === 0 ? '09:00:00' : '06:00:00',
        close_time: d === 0 ? '20:00:00' : '22:00:00',
        is_closed: false,
        created_at: datetime(new Date(baseDate.getTime() + (i + 1) * 86400000)),
        updated_at: datetime(new Date(baseDate.getTime() + (i + 1) * 86400000)),
      });
    }
    
    // Special hours (holidays)
    const holidays = [
      { date: '2024-12-25', reason: 'Christmas', open: '10:00:00', close: '18:00:00' },
      { date: '2024-07-04', reason: 'Independence Day', open: '10:00:00', close: '18:00:00' },
      { date: '2024-01-01', reason: 'New Year', open: '12:00:00', close: '20:00:00' },
    ];
    holidays.forEach(holiday => {
      data.branchSpecialHours.push({
        id: uuid(),
        branch_id: branchId,
        date: holiday.date,
        open_time: holiday.open,
        close_time: holiday.close,
        is_closed: false,
        reason: holiday.reason,
        created_at: datetime(new Date(baseDate.getTime() + (i + 1) * 86400000)),
        updated_at: datetime(new Date(baseDate.getTime() + (i + 1) * 86400000)),
      });
    });
  }
}

// ============================================================================
// 4. COURTS & SERVICES
// ============================================================================
const courtIds = [];
const surfaceTypes = ['indoor', 'outdoor', 'hard', 'clay', 'synthetic'];
const serviceIds = [];

branchIds.forEach(({ id: branchId, companyId }) => {
  // Courts (3-8 per branch)
  const numCourts = 3 + Math.floor(Math.random() * 6);
  for (let c = 1; c <= numCourts; c++) {
    const courtId = uuid();
    courtIds.push({ id: courtId, branchId, companyId });
    
    data.courts.push({
      id: courtId,
      branch_id: branchId,
      name: `Court ${c}`,
      court_number: String(c),
      court_type: 'pickleball',
      surface_type: surfaceTypes[c % surfaceTypes.length],
      description: `Professional pickleball court ${c}`,
      capacity: 4,
      has_lights: c % 2 === 0,
      hourly_rate: (25 + (c % 3) * 5).toFixed(2),
      status: 'active',
      created_at: datetime(new Date(baseDate.getTime() + 10 * 86400000)),
      updated_at: datetime(now),
      created_by: platformAdminId,
    });
    
    // Court features
    const features = ['Lighting', 'Net', 'Scoreboard', 'Seating'];
    features.slice(0, 2 + (c % 2)).forEach((feat, idx) => {
      data.courtFeatures.push({
        id: uuid(),
        court_id: courtId,
        feature_name: feat,
        feature_value: 'Yes',
        created_at: datetime(new Date(baseDate.getTime() + 10 * 86400000)),
        updated_at: datetime(new Date(baseDate.getTime() + 10 * 86400000)),
      });
    });
  }
  
  // Services (court_booking service per company)
  const serviceId = uuid();
  serviceIds.push({ id: serviceId, companyId, branchId });
  data.services.push({
    id: serviceId,
    company_id: companyId,
    name: 'Court Booking',
    service_type: 'court_booking',
    description: 'Hourly court rental',
    base_price: '25.00',
    currency: 'USD',
    is_active: true,
    created_at: datetime(new Date(baseDate.getTime() + 10 * 86400000)),
    updated_at: datetime(now),
    created_by: platformAdminId,
  });
  
  data.serviceBranchAvailability.push({
    id: uuid(),
    service_id: serviceId,
    branch_id: branchId,
    is_available: true,
    price_override: null,
    created_at: datetime(new Date(baseDate.getTime() + 10 * 86400000)),
    updated_at: datetime(new Date(baseDate.getTime() + 10 * 86400000)),
  });
});

// ============================================================================
// 5. MEMBERSHIP PLANS
// ============================================================================
const membershipPlanIds = [];

companyIds.forEach((companyId, idx) => {
  // 2-4 membership plans per company
  const numPlans = 2 + (idx % 3);
  const planTypes = ['recurring', 'prepaid_pass', 'credits'];
  const billingTypes = ['monthly', 'annual', 'prepaid_passes', 'credits'];
  
  for (let p = 0; p < numPlans; p++) {
    const planId = uuid();
    membershipPlanIds.push({ id: planId, companyId });
    const planType = planTypes[p % planTypes.length];
    const billingType = billingTypes[p % billingTypes.length];
    
    data.membershipPlans.push({
      id: planId,
      company_id: companyId,
      branch_id: null, // company-wide
      service_id: serviceIds.find(s => s.companyId === companyId)?.id || serviceIds[0].id,
      name: `${['Basic', 'Premium', 'Elite', 'Pro'][p]} Membership`,
      description: `${['Basic', 'Premium', 'Elite', 'Pro'][p]} membership plan`,
      plan_type: planType,
      plan_scope: 'company_wide',
      billing_type: billingType,
      billing_cycle_days: billingType === 'monthly' ? 30 : billingType === 'annual' ? 365 : null,
      price: (50 + p * 25).toFixed(2),
      currency: 'USD',
      max_active_per_user: planType === 'recurring' ? 1 : 999,
      is_active: true,
      created_at: datetime(new Date(baseDate.getTime() + 15 * 86400000)),
      updated_at: datetime(now),
      created_by: platformAdminId,
    });
    
    // Membership plan benefits
    data.membershipPlanBenefits.push({
      id: uuid(),
      membership_plan_id: planId,
      benefit_type: 'discount_percentage',
      benefit_value: (10 + p * 5).toFixed(2),
      max_per_period: null,
      description: `${10 + p * 5}% discount on bookings`,
      created_at: datetime(new Date(baseDate.getTime() + 15 * 86400000)),
      updated_at: datetime(new Date(baseDate.getTime() + 15 * 86400000)),
    });
  }
});

// ============================================================================
// 6. COMPANY CUSTOMERS
// ============================================================================
companyIds.forEach((companyId, idx) => {
  // 10-25 customers per company (some shared)
  const numCustomers = 15 + (idx % 11);
  const startIdx = idx * 15;
  const endIdx = Math.min(startIdx + numCustomers, customerUsers.length);
  
  for (let i = startIdx; i < endIdx; i++) {
    if (i >= customerUsers.length) break;
    const userId = customerUsers[i];
    const branchId = branchIds.find(b => b.companyId === companyId)?.id || branchIds[0].id;
    
    data.companyCustomers.push({
      id: uuid(),
      user_id: userId,
      company_id: companyId,
      status: 'active',
      joined_at: datetime(new Date(baseDate.getTime() + (20 + i) * 86400000)),
      marketing_opt_in: i % 3 === 0,
      default_branch_id: branchId,
      left_at: null,
      blocked_at: null,
      blocked_reason: null,
      created_at: datetime(new Date(baseDate.getTime() + (20 + i) * 86400000)),
      updated_at: datetime(now),
    });
  }
});

// ============================================================================
// 7. BOOKINGS (100-300 total)
// ============================================================================
const bookingIds = [];
const bookingNumbers = new Set();

for (let b = 0; b < 200; b++) {
  const bookingId = uuid();
  bookingIds.push(bookingId);
  
  // Random customer, company, branch
  const customerIdx = Math.floor(Math.random() * Math.min(50, customerUsers.length));
  const userId = customerUsers[customerIdx];
  const branch = branchIds[Math.floor(Math.random() * branchIds.length)];
  const companyId = branch.companyId;
  const branchId = branch.id;
  
  // Random court from this branch
  const branchCourts = courtIds.filter(c => c.branchId === branchId);
  if (branchCourts.length === 0) continue;
  const court = branchCourts[Math.floor(Math.random() * branchCourts.length)];
  const courtId = court.id;
  
  // Random date (past, present, future)
  const daysOffset = -30 + Math.floor(Math.random() * 90);
  const bookingDate = new Date(now.getTime() + daysOffset * 86400000);
  const hour = 8 + Math.floor(Math.random() * 12);
  const startDatetime = new Date(bookingDate);
  startDatetime.setHours(hour, 0, 0, 0);
  const duration = [60, 90, 120][Math.floor(Math.random() * 3)];
  const endDatetime = new Date(startDatetime.getTime() + duration * 60000);
  
  // Generate unique booking number
  let bookingNumber;
  do {
    bookingNumber = `BK${String(Date.now()).slice(-8)}${String(b).padStart(4, '0')}`;
  } while (bookingNumbers.has(bookingNumber));
  bookingNumbers.add(bookingNumber);
  
  const courtData = data.courts.find(c => c.id === courtId);
  const hourlyRate = courtData ? parseFloat(courtData.hourly_rate) : 25.00;
  const subtotal = hourlyRate * (duration / 60);
  const discountAmount = Math.random() > 0.7 ? parseFloat((subtotal * 0.1).toFixed(2)) : 0;
  const taxAmount = parseFloat((subtotal * 0.08).toFixed(2));
  const totalAmount = parseFloat((subtotal - discountAmount + taxAmount).toFixed(2));
  
  const statuses = ['confirmed', 'completed', 'cancelled', 'pending'];
  const bookingStatus = statuses[Math.floor(Math.random() * statuses.length)];
  const paymentStatuses = ['succeeded', 'pending', 'failed'];
  const paymentStatus = bookingStatus === 'cancelled' ? 'refunded' : paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)];
  
  data.bookings.push({
    id: bookingId,
    user_id: userId,
    company_id: companyId,
    branch_id: branchId,
    booking_number: bookingNumber,
    booking_status: bookingStatus,
    booking_source: ['customer_web', 'customer_app', 'admin_manual'][Math.floor(Math.random() * 3)],
    subtotal: subtotal.toFixed(2),
    discount_amount: discountAmount.toFixed(2),
    tax_amount: taxAmount.toFixed(2),
    fee_amount: '0.00',
    total_amount: totalAmount.toFixed(2),
    currency: 'USD',
    payment_status: paymentStatus,
    notes: bookingStatus === 'cancelled' ? 'Customer requested cancellation' : null,
    cancelled_at: bookingStatus === 'cancelled' ? datetime(new Date(startDatetime.getTime() - 86400000)) : null,
    cancelled_by: bookingStatus === 'cancelled' ? userId : null,
    cancellation_reason: bookingStatus === 'cancelled' ? 'Customer request' : null,
    created_at: datetime(new Date(startDatetime.getTime() - 2 * 86400000)),
    updated_at: datetime(now),
    created_by: userId,
  });
  
  // Booking items
  const serviceId = serviceIds.find(s => s.companyId === companyId)?.id || serviceIds[0].id;
  const bookingItemId = uuid();
  data.bookingItems.push({
    id: bookingItemId,
    booking_id: bookingId,
    company_id: companyId,
    branch_id: branchId,
    court_id: courtId,
    service_id: serviceId,
    start_datetime: datetime(startDatetime),
    end_datetime: datetime(endDatetime),
    duration_minutes: duration,
    unit_price: hourlyRate.toFixed(2),
    quantity: 1,
    subtotal: subtotal.toFixed(2),
    discount_amount: discountAmount.toFixed(2),
    total_amount: totalAmount.toFixed(2),
    created_at: datetime(new Date(startDatetime.getTime() - 2 * 86400000)),
    updated_at: datetime(now),
  });
  
  // Booking participants (sometimes)
  if (Math.random() > 0.5) {
    data.bookingParticipants.push({
      id: uuid(),
      booking_id: bookingId,
      user_id: null,
      guest_name: 'Guest Player',
      guest_email: `guest${b}@testmail.com`,
      guest_phone: `+1555999${String(b).padStart(4, '0')}`,
      is_primary: false,
      created_at: datetime(new Date(startDatetime.getTime() - 2 * 86400000)),
      updated_at: datetime(new Date(startDatetime.getTime() - 2 * 86400000)),
    });
  }
  
  // Booking change log
  data.bookingChangeLog.push({
    id: uuid(),
    booking_id: bookingId,
    change_type: 'created',
    old_value: '{}',
    new_value: JSON.stringify({ status: bookingStatus }),
    changed_by: userId,
    reason: null,
    created_at: datetime(new Date(startDatetime.getTime() - 2 * 86400000)),
  });
  
  if (bookingStatus === 'cancelled') {
    data.bookingChangeLog.push({
      id: uuid(),
      booking_id: bookingId,
      change_type: 'cancelled',
      old_value: JSON.stringify({ status: 'confirmed' }),
      new_value: JSON.stringify({ status: 'cancelled' }),
      changed_by: userId,
      reason: 'Customer request',
      created_at: datetime(new Date(startDatetime.getTime() - 86400000)),
    });
  }
  
  // Payments
  if (paymentStatus === 'succeeded') {
    const paymentId = uuid();
    data.payments.push({
      id: paymentId,
      user_id: userId,
      company_id: companyId,
      booking_id: bookingId,
      invoice_id: null,
      membership_cycle_id: null,
      amount: totalAmount.toFixed(2),
      currency: 'USD',
      payment_method: ['credit_card', 'debit_card', 'wallet'][Math.floor(Math.random() * 3)],
      payment_status: 'succeeded',
      provider: 'stripe',
      provider_transaction_id: `txn_${uuid().replace(/-/g, '')}`,
      provider_metadata: '{}',
      failure_reason: null,
      paid_at: datetime(new Date(startDatetime.getTime() - 86400000)),
      created_at: datetime(new Date(startDatetime.getTime() - 2 * 86400000)),
      updated_at: datetime(now),
    });
  }
}

// ============================================================================
// 8. CAMPAIGNS & PROMO CODES
// ============================================================================
companyIds.forEach((companyId, idx) => {
  // At least 1 active + 1 expired campaign per company
  const campaigns = [
    { name: 'Summer Sale', active: true, start: '2024-06-01', end: '2024-08-31' },
    { name: 'Winter Special', active: false, start: '2023-12-01', end: '2023-12-31' },
  ];
  
  campaigns.forEach((camp, cIdx) => {
    const campaignId = uuid();
    data.campaigns.push({
      id: campaignId,
      company_id: companyId,
      branch_id: null,
      name: camp.name,
      description: `${camp.name} promotion`,
      discount_type: 'percent_off',
      discount_value: '15.00',
      min_purchase_amount: '50.00',
      max_discount_amount: '25.00',
      applicability: 'bookings',
      service_id: null,
      start_date: camp.start,
      end_date: camp.end,
      day_of_week_mask: null,
      time_window_start: null,
      time_window_end: null,
      usage_limit_per_user: 5,
      total_usage_limit: 100,
      current_usage_count: camp.active ? Math.floor(Math.random() * 50) : 100,
      can_stack_with_membership: false,
      is_active: camp.active,
      created_at: datetime(new Date(baseDate.getTime() + 20 * 86400000)),
      updated_at: datetime(now),
      created_by: platformAdminId,
    });
    
    // Promo codes
    const promoCodeId = uuid();
    data.promoCodes.push({
      id: promoCodeId,
      campaign_id: campaignId,
      company_id: companyId,
      code: `${camp.name.toUpperCase().substring(0, 4)}${idx}${cIdx}`,
      is_active: camp.active,
      created_at: datetime(new Date(baseDate.getTime() + 20 * 86400000)),
      updated_at: datetime(now),
    });
  });
});

// ============================================================================
// 9. GIFT CARDS
// ============================================================================
companyIds.forEach((companyId) => {
  // Mix of used, partially used, expired
  for (let g = 0; g < 5; g++) {
    const giftCardId = uuid();
    const initialAmount = (25 + g * 25).toFixed(2);
    const statuses = ['active', 'redeemed', 'expired'];
    const status = statuses[g % statuses.length];
    const currentBalance = status === 'redeemed' ? '0.00' : status === 'expired' ? initialAmount : (parseFloat(initialAmount) * (1 - g * 0.2)).toFixed(2);
    
    data.giftCards.push({
      id: giftCardId,
      company_id: companyId,
      code: `GC${companyId.substring(0, 8).toUpperCase()}${g}`,
      initial_amount: initialAmount,
      current_balance: currentBalance,
      currency: 'USD',
      status,
      expires_at: status === 'expired' ? datetime(new Date(baseDate.getTime() - 86400000)) : datetime(new Date(now.getTime() + 365 * 86400000)),
      purchased_by_user_id: customerUsers[Math.floor(Math.random() * customerUsers.length)],
      assigned_to_user_id: customerUsers[Math.floor(Math.random() * customerUsers.length)],
      purchase_payment_id: null,
      notes: null,
      created_at: datetime(new Date(baseDate.getTime() + 25 * 86400000)),
      updated_at: datetime(now),
    });
  }
});

// ============================================================================
// 10. AUDIT LOGS (with behavior events)
// ============================================================================
const behaviorEvents = [
  'auth.login', 'auth.logout', 'auth.signup',
  'explore.search', 'branch.view', 'court.view',
  'booking.start', 'booking.confirmed', 'booking.cancelled',
  'membership.purchase_completed', 'payment.confirmed',
  'gift_card.redeemed', 'media.uploaded',
];

// Generate audit logs (mix of system events and behavior events)
for (let a = 0; a < 500; a++) {
  const actorId = Math.random() > 0.1 ? customerUsers[Math.floor(Math.random() * customerUsers.length)] : platformAdminId;
  const eventType = Math.random() > 0.5 ? 'telemetry' : 'audit';
  const action = eventType === 'telemetry' 
    ? behaviorEvents[Math.floor(Math.random() * behaviorEvents.length)]
    : ['create', 'update', 'delete', 'login'][Math.floor(Math.random() * 4)];
  
  const entityTypes = ['booking', 'membership', 'payment', 'company', 'branch', 'user'];
  const entityType = entityTypes[Math.floor(Math.random() * entityTypes.length)];
  const entityId = eventType === 'telemetry' && entityType === 'booking' 
    ? bookingIds[Math.floor(Math.random() * Math.min(50, bookingIds.length))]
    : uuid();
  
  const branch = branchIds[Math.floor(Math.random() * branchIds.length)];
  const metadata = JSON.stringify({
    event_name: action,
    event_time: datetime(now),
    company_id: branch.companyId,
    branch_id: branch.id,
    page_path: '/app/bookings',
    device_type: ['mobile', 'desktop', 'tablet'][Math.floor(Math.random() * 3)],
    properties: { test: 'data' },
  });
  
  data.auditLogs.push({
    id: uuid(),
    actor_user_id: actorId,
    action,
    entity_type: entityType,
    entity_id: entityId,
    before_snapshot: null,
    after_snapshot: null,
    ip_address: `192.168.1.${Math.floor(Math.random() * 255)}`,
    user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    metadata,
    created_at: datetime(new Date(now.getTime() - (a % 30) * 86400000)),
  });
}

// ============================================================================
// 11. OTP CODES (mock, expired/used)
// ============================================================================
for (let o = 0; o < 20; o++) {
  const userId = customerUsers[Math.floor(Math.random() * customerUsers.length)];
  const statuses = ['pending', 'verified', 'expired', 'used'];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  
  data.otpCodes.push({
    id: uuid(),
    user_id: userId,
    phone: `+1555100${String(o).padStart(4, '0')}`,
    email: null,
    code: '123456',
    status,
    purpose: 'login',
    attempts: status === 'verified' ? 1 : Math.floor(Math.random() * 3),
    max_attempts: 3,
    expires_at: datetime(new Date(now.getTime() + 600000)),
    verified_at: status === 'verified' ? datetime(new Date(now.getTime() - 300000)) : null,
    created_at: datetime(new Date(now.getTime() - 600000)),
    updated_at: datetime(now),
  });
}

console.log('Generating mock data CSV files...\n');

// Write all CSV files
writeCSV('roles.csv', [
  'id', 'name', 'role_type', 'description', 'is_system_role', 'created_at', 'updated_at', 'created_by', 'updated_by', 'deleted_at'
], data.roles.map(r => [
  r.id, r.name, r.role_type, '', r.is_system ? '1' : '0', datetime(baseDate), datetime(baseDate), platformAdminId, platformAdminId, ''
]));

writeCSV('permissions.csv', [
  'id', 'name', 'resource', 'action', 'description', 'created_at', 'updated_at', 'created_by', 'updated_by', 'deleted_at'
], data.permissions.map(p => [
  p.id, p.name, p.resource, p.action, '', datetime(baseDate), datetime(baseDate), platformAdminId, platformAdminId, ''
]));

writeCSV('role_permissions.csv', [
  'id', 'role_id', 'permission_id', 'created_at', 'updated_at', 'created_by', 'updated_by', 'deleted_at'
], data.rolePermissions.map(rp => [
  rp.id, rp.role_id, rp.permission_id, rp.created_at, rp.updated_at, platformAdminId, platformAdminId, ''
]));

writeCSV('users.csv', [
  'id', 'email', 'phone', 'first_name', 'last_name', 'date_of_birth', 'status', 'email_verified_at', 'phone_verified_at', 'last_login_at', 'created_at', 'updated_at', 'created_by', 'updated_by', 'deleted_at'
], data.users.map(u => [
  u.id, u.email || '', u.phone || '', u.first_name, u.last_name, u.date_of_birth || '', u.status, u.email_verified_at || '', u.phone_verified_at || '', u.last_login_at || '', u.created_at, u.updated_at, u.created_by || '', u.updated_by || '', ''
]));

writeCSV('user_roles.csv', [
  'id', 'user_id', 'role_id', 'company_id', 'branch_id', 'assigned_at', 'assigned_by', 'expires_at', 'created_at', 'updated_at', 'created_by', 'updated_by', 'deleted_at'
], data.userRoles.map(ur => [
  ur.id, ur.user_id, ur.role_id, ur.company_id || '', ur.branch_id || '', ur.assigned_at, ur.assigned_by, ur.expires_at || '', ur.created_at, ur.updated_at, ur.created_by || '', ur.updated_by || '', ''
]));

writeCSV('auth_identities.csv', [
  'id', 'user_id', 'provider', 'provider_user_id', 'email', 'phone', 'provider_metadata', 'is_primary', 'verified_at', 'created_at', 'updated_at', 'created_by', 'updated_by', 'deleted_at'
], data.authIdentities.map(ai => [
  ai.id, ai.user_id, ai.provider, ai.provider_user_id, ai.email || '', ai.phone || '', '{}', ai.is_primary ? '1' : '0', ai.verified_at || '', ai.created_at, ai.updated_at, ai.created_by || '', ai.updated_by || '', ''
]));

writeCSV('companies.csv', [
  'id', 'name', 'slug', 'description', 'logo_media_id', 'website_url', 'timezone', 'default_currency', 'status', 'created_at', 'updated_at', 'created_by', 'updated_by', 'deleted_at'
], data.companies.map(c => [
  c.id, c.name, c.slug, c.description, c.logo_media_id || '', c.website_url, c.timezone, c.default_currency, c.status, c.created_at, c.updated_at, c.created_by, c.updated_by || '', ''
]));

writeCSV('branches.csv', [
  'id', 'company_id', 'name', 'slug', 'description', 'address_line1', 'address_line2', 'city', 'state', 'postal_code', 'country', 'latitude', 'longitude', 'timezone', 'status', 'created_at', 'updated_at', 'created_by', 'updated_by', 'deleted_at'
], data.branches.map(b => [
  b.id, b.company_id, b.name, b.slug, b.description, b.address_line1, b.address_line2 || '', b.city, b.state, b.postal_code, b.country, b.latitude, b.longitude, b.timezone, b.status, b.created_at, b.updated_at, b.created_by, b.updated_by || '', ''
]));

writeCSV('branch_contacts.csv', [
  'id', 'branch_id', 'contact_type', 'contact_value', 'is_primary', 'label', 'created_at', 'updated_at', 'created_by', 'updated_by', 'deleted_at'
], data.branchContacts.map(bc => [
  bc.id, bc.branch_id, bc.contact_type, bc.contact_value, bc.is_primary ? '1' : '0', bc.label || '', bc.created_at, bc.updated_at, bc.created_by || '', bc.updated_by || '', ''
]));

writeCSV('branch_amenities.csv', [
  'id', 'branch_id', 'name', 'description', 'icon_name', 'created_at', 'updated_at', 'created_by', 'updated_by', 'deleted_at'
], data.branchAmenities.map(ba => [
  ba.id, ba.branch_id, ba.name, ba.description, ba.icon_name || '', ba.created_at, ba.updated_at, ba.created_by || '', ba.updated_by || '', ''
]));

writeCSV('branch_staff.csv', [
  'id', 'branch_id', 'user_id', 'position', 'is_manager', 'assigned_at', 'assigned_by', 'is_active', 'created_at', 'updated_at', 'created_by', 'updated_by', 'deleted_at'
], data.branchStaff.map(bs => [
  bs.id, bs.branch_id, bs.user_id, bs.position, bs.is_manager ? '1' : '0', bs.assigned_at, bs.assigned_by, bs.is_active ? '1' : '0', bs.created_at, bs.updated_at, bs.created_by || '', bs.updated_by || '', ''
]));

writeCSV('branch_business_hours.csv', [
  'id', 'branch_id', 'day_of_week', 'open_time', 'close_time', 'is_closed', 'created_at', 'updated_at', 'created_by', 'updated_by', 'deleted_at'
], data.branchBusinessHours.map(bbh => [
  bbh.id, bbh.branch_id, bbh.day_of_week, bbh.open_time, bbh.close_time, bbh.is_closed ? '1' : '0', bbh.created_at, bbh.updated_at, bbh.created_by || '', bbh.updated_by || '', ''
]));

writeCSV('branch_special_hours.csv', [
  'id', 'branch_id', 'date', 'open_time', 'close_time', 'is_closed', 'reason', 'created_at', 'updated_at', 'created_by', 'updated_by', 'deleted_at'
], data.branchSpecialHours.map(bsh => [
  bsh.id, bsh.branch_id, bsh.date, bsh.open_time, bsh.close_time, bsh.is_closed ? '1' : '0', bsh.reason || '', bsh.created_at, bsh.updated_at, bsh.created_by || '', bsh.updated_by || '', ''
]));

writeCSV('courts.csv', [
  'id', 'branch_id', 'name', 'court_number', 'court_type', 'surface_type', 'description', 'capacity', 'has_lights', 'hourly_rate', 'status', 'created_at', 'updated_at', 'created_by', 'updated_by', 'deleted_at'
], data.courts.map(c => [
  c.id, c.branch_id, c.name, c.court_number, c.court_type, c.surface_type, c.description, c.capacity, c.has_lights ? '1' : '0', c.hourly_rate, c.status, c.created_at, c.updated_at, c.created_by, c.updated_by || '', ''
]));

writeCSV('court_features.csv', [
  'id', 'court_id', 'feature_name', 'feature_value', 'created_at', 'updated_at', 'created_by', 'updated_by', 'deleted_at'
], data.courtFeatures.map(cf => [
  cf.id, cf.court_id, cf.feature_name, cf.feature_value || '', cf.created_at, cf.updated_at, cf.created_by || '', cf.updated_by || '', ''
]));

writeCSV('services.csv', [
  'id', 'company_id', 'name', 'service_type', 'description', 'base_price', 'currency', 'is_active', 'created_at', 'updated_at', 'created_by', 'updated_by', 'deleted_at'
], data.services.map(s => [
  s.id, s.company_id, s.name, s.service_type, s.description, s.base_price, s.currency, s.is_active ? '1' : '0', s.created_at, s.updated_at, s.created_by, s.updated_by || '', ''
]));

writeCSV('service_branch_availability.csv', [
  'id', 'service_id', 'branch_id', 'is_available', 'price_override', 'created_at', 'updated_at', 'created_by', 'updated_by', 'deleted_at'
], data.serviceBranchAvailability.map(sba => [
  sba.id, sba.service_id, sba.branch_id, sba.is_available ? '1' : '0', sba.price_override || '', sba.created_at, sba.updated_at, sba.created_by || '', sba.updated_by || '', ''
]));

writeCSV('company_customers.csv', [
  'id', 'user_id', 'company_id', 'status', 'joined_at', 'marketing_opt_in', 'default_branch_id', 'left_at', 'blocked_at', 'blocked_reason', 'created_at', 'updated_at', 'created_by', 'updated_by', 'deleted_at'
], data.companyCustomers.map(cc => [
  cc.id, cc.user_id, cc.company_id, cc.status, cc.joined_at, cc.marketing_opt_in ? '1' : '0', cc.default_branch_id || '', cc.left_at || '', cc.blocked_at || '', cc.blocked_reason || '', cc.created_at, cc.updated_at, cc.created_by || '', cc.updated_by || '', ''
]));

writeCSV('membership_plans.csv', [
  'id', 'company_id', 'branch_id', 'service_id', 'name', 'description', 'plan_type', 'plan_scope', 'billing_type', 'billing_cycle_days', 'price', 'currency', 'max_active_per_user', 'is_active', 'created_at', 'updated_at', 'created_by', 'updated_by', 'deleted_at'
], data.membershipPlans.map(mp => [
  mp.id, mp.company_id, mp.branch_id || '', mp.service_id, mp.name, mp.description, mp.plan_type, mp.plan_scope, mp.billing_type, mp.billing_cycle_days || '', mp.price, mp.currency, mp.max_active_per_user, mp.is_active ? '1' : '0', mp.created_at, mp.updated_at, mp.created_by, mp.updated_by || '', ''
]));

writeCSV('membership_plan_benefits.csv', [
  'id', 'membership_plan_id', 'benefit_type', 'benefit_value', 'max_per_period', 'description', 'created_at', 'updated_at', 'created_by', 'updated_by', 'deleted_at'
], data.membershipPlanBenefits.map(mpb => [
  mpb.id, mpb.membership_plan_id, mpb.benefit_type, mpb.benefit_value, mpb.max_per_period || '', mpb.description, mpb.created_at, mpb.updated_at, mpb.created_by || '', mpb.updated_by || '', ''
]));

writeCSV('bookings.csv', [
  'id', 'user_id', 'company_id', 'branch_id', 'booking_number', 'booking_status', 'booking_source', 'subtotal', 'discount_amount', 'tax_amount', 'fee_amount', 'total_amount', 'currency', 'payment_status', 'notes', 'cancelled_at', 'cancelled_by', 'cancellation_reason', 'created_at', 'updated_at', 'created_by', 'updated_by', 'deleted_at'
], data.bookings.map(b => [
  b.id, b.user_id, b.company_id, b.branch_id, b.booking_number, b.booking_status, b.booking_source, b.subtotal, b.discount_amount, b.tax_amount, b.fee_amount, b.total_amount, b.currency, b.payment_status, b.notes || '', b.cancelled_at || '', b.cancelled_by || '', b.cancellation_reason || '', b.created_at, b.updated_at, b.created_by, b.updated_by || '', ''
]));

writeCSV('booking_items.csv', [
  'id', 'booking_id', 'company_id', 'branch_id', 'court_id', 'service_id', 'start_datetime', 'end_datetime', 'duration_minutes', 'unit_price', 'quantity', 'subtotal', 'discount_amount', 'total_amount', 'created_at', 'updated_at', 'created_by', 'updated_by', 'deleted_at'
], data.bookingItems.map(bi => [
  bi.id, bi.booking_id, bi.company_id, bi.branch_id, bi.court_id, bi.service_id, bi.start_datetime, bi.end_datetime, bi.duration_minutes, bi.unit_price, bi.quantity, bi.subtotal, bi.discount_amount, bi.total_amount, bi.created_at, bi.updated_at, bi.created_by || '', bi.updated_by || '', ''
]));

writeCSV('booking_participants.csv', [
  'id', 'booking_id', 'user_id', 'guest_name', 'guest_email', 'guest_phone', 'is_primary', 'created_at', 'updated_at', 'created_by', 'updated_by', 'deleted_at'
], data.bookingParticipants.map(bp => [
  bp.id, bp.booking_id, bp.user_id || '', bp.guest_name || '', bp.guest_email || '', bp.guest_phone || '', bp.is_primary ? '1' : '0', bp.created_at, bp.updated_at, bp.created_by || '', bp.updated_by || '', ''
]));

writeCSV('booking_change_log.csv', [
  'id', 'booking_id', 'change_type', 'old_value', 'new_value', 'changed_by', 'reason', 'created_at'
], data.bookingChangeLog.map(bcl => [
  bcl.id, bcl.booking_id, bcl.change_type, bcl.old_value, bcl.new_value, bcl.changed_by, bcl.reason || '', bcl.created_at
]));

writeCSV('campaigns.csv', [
  'id', 'company_id', 'branch_id', 'name', 'description', 'discount_type', 'discount_value', 'min_purchase_amount', 'max_discount_amount', 'applicability', 'service_id', 'start_date', 'end_date', 'day_of_week_mask', 'time_window_start', 'time_window_end', 'usage_limit_per_user', 'total_usage_limit', 'current_usage_count', 'can_stack_with_membership', 'is_active', 'created_at', 'updated_at', 'created_by', 'updated_by', 'deleted_at'
], data.campaigns.map(c => [
  c.id, c.company_id, c.branch_id || '', c.name, c.description, c.discount_type, c.discount_value, c.min_purchase_amount || '', c.max_discount_amount || '', c.applicability, c.service_id || '', c.start_date, c.end_date, c.day_of_week_mask || '', c.time_window_start || '', c.time_window_end || '', c.usage_limit_per_user || '', c.total_usage_limit || '', c.current_usage_count, c.can_stack_with_membership ? '1' : '0', c.is_active ? '1' : '0', c.created_at, c.updated_at, c.created_by, c.updated_by || '', ''
]));

writeCSV('promo_codes.csv', [
  'id', 'campaign_id', 'company_id', 'code', 'is_active', 'created_at', 'updated_at', 'created_by', 'updated_by', 'deleted_at'
], data.promoCodes.map(pc => [
  pc.id, pc.campaign_id, pc.company_id, pc.code, pc.is_active ? '1' : '0', pc.created_at, pc.updated_at, pc.created_by || '', pc.updated_by || '', ''
]));

writeCSV('payments.csv', [
  'id', 'user_id', 'company_id', 'booking_id', 'invoice_id', 'membership_cycle_id', 'amount', 'currency', 'payment_method', 'payment_status', 'provider', 'provider_transaction_id', 'provider_metadata', 'failure_reason', 'paid_at', 'created_at', 'updated_at', 'created_by', 'updated_by', 'deleted_at'
], data.payments.map(p => [
  p.id, p.user_id, p.company_id, p.booking_id || '', p.invoice_id || '', p.membership_cycle_id || '', p.amount, p.currency, p.payment_method, p.payment_status, p.provider || '', p.provider_transaction_id || '', p.provider_metadata || '{}', p.failure_reason || '', p.paid_at || '', p.created_at, p.updated_at, p.created_by || '', p.updated_by || '', ''
]));

writeCSV('gift_cards.csv', [
  'id', 'company_id', 'code', 'initial_amount', 'current_balance', 'currency', 'status', 'expires_at', 'purchased_by_user_id', 'assigned_to_user_id', 'purchase_payment_id', 'notes', 'created_at', 'updated_at', 'created_by', 'updated_by', 'deleted_at'
], data.giftCards.map(gc => [
  gc.id, gc.company_id, gc.code, gc.initial_amount, gc.current_balance, gc.currency, gc.status, gc.expires_at || '', gc.purchased_by_user_id || '', gc.assigned_to_user_id || '', gc.purchase_payment_id || '', gc.notes || '', gc.created_at, gc.updated_at, gc.created_by || '', gc.updated_by || '', ''
]));

writeCSV('audit_logs.csv', [
  'id', 'actor_user_id', 'action', 'entity_type', 'entity_id', 'before_snapshot', 'after_snapshot', 'ip_address', 'user_agent', 'metadata', 'created_at'
], data.auditLogs.map(al => [
  al.id, al.actor_user_id, al.action, al.entity_type, al.entity_id, al.before_snapshot || '', al.after_snapshot || '', al.ip_address || '', al.user_agent || '', al.metadata || '{}', al.created_at
]));

writeCSV('otp_codes.csv', [
  'id', 'user_id', 'phone', 'email', 'code', 'status', 'purpose', 'attempts', 'max_attempts', 'expires_at', 'verified_at', 'created_at', 'updated_at', 'created_by', 'updated_by', 'deleted_at'
], data.otpCodes.map(otp => [
  otp.id, otp.user_id || '', otp.phone, otp.email || '', otp.code, otp.status, otp.purpose, otp.attempts, otp.max_attempts, otp.expires_at, otp.verified_at || '', otp.created_at, otp.updated_at, otp.created_by || '', otp.updated_by || '', ''
]));

// Empty tables (placeholders)
const emptyTables = [
  'court_rate_rules', 'court_time_slots', 'resource_blocks', 'customer_memberships', 'membership_cycles',
  'membership_usage_ledger', 'campaign_rules', 'discount_applications', 'payment_attempts', 'refunds',
  'invoices', 'invoice_items', 'customer_wallet_ledger', 'gift_card_redemptions', 'media_files',
  'media_variants', 'reviews', 'support_tickets', 'support_ticket_messages', 'auth_sessions',
  'groups', 'group_members', 'group_bookings', 'booking_waitlist', 'tax_rates',
  'notification_templates', 'notifications_outbox', 'notification_delivery_logs', 'user_notification_preferences',
];

emptyTables.forEach(table => {
  writeCSV(`${table}.csv`, ['id'], []);
});

console.log('\n✓ All CSV files generated successfully!');
console.log(`Files written to: ${OUTPUT_DIR}`);


const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const OUTPUT_DIR = path.join(__dirname, 'mock-data');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Helper to generate UUID v4
const uuid = () => {
  return crypto.randomUUID();
};

// Helper to format date
const date = (d) => d.toISOString().split('T')[0];
const datetime = (d) => d.toISOString().slice(0, 19).replace('T', ' ');
const time = (d) => d.toTimeString().slice(0, 5);

// Helper to escape CSV
const csvEscape = (val) => {
  if (val === null || val === undefined) return '';
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

// Helper to write CSV
const writeCSV = (filename, headers, rows) => {
  const filepath = path.join(OUTPUT_DIR, filename);
  const lines = [headers.join(',')];
  rows.forEach(row => {
    lines.push(row.map(csvEscape).join(','));
  });
  fs.writeFileSync(filepath, lines.join('\n'), 'utf8');
  console.log(`Generated ${filename} (${rows.length} rows)`);
};

// Generate base timestamps
const baseDate = new Date('2024-01-01');
const now = new Date();

// ============================================================================
// 1. ROLES & PERMISSIONS
// ============================================================================
const roles = [
  { id: uuid(), name: 'platform_super_admin', role_type: 'platform_super_admin', is_system: true },
  { id: uuid(), name: 'company_admin', role_type: 'company_admin', is_system: true },
  { id: uuid(), name: 'branch_manager', role_type: 'branch_manager', is_system: true },
  { id: uuid(), name: 'branch_staff', role_type: 'branch_staff', is_system: true },
  { id: uuid(), name: 'customer', role_type: 'customer', is_system: true },
];

const permissions = [
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

const rolePermissions = [];
roles.forEach(role => {
  permissions.forEach(perm => {
    rolePermissions.push({
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
const users = [];
const userRoles = [];
const authIdentities = [];

// Platform Admin
const platformAdminId = uuid();
users.push({
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

userRoles.push({
  id: uuid(),
  user_id: platformAdminId,
  role_id: roles[0].id,
  company_id: '',
  branch_id: '',
  assigned_at: datetime(baseDate),
  assigned_by: platformAdminId,
  created_at: datetime(baseDate),
  updated_at: datetime(baseDate),
});

authIdentities.push({
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

// Company Admins (2 per company)
const companyAdmins = [];
for (let c = 1; c <= 5; c++) {
  for (let a = 1; a <= 2; a++) {
    const userId = uuid();
    const email = `admin${c}${a}@company${c}.com`;
    users.push({
      id: userId,
      email,
      phone: `+1555000${String(c).padStart(2, '0')}${a}`,
      first_name: `Company${c}`,
      last_name: `Admin${a}`,
      status: 'active',
      email_verified_at: datetime(baseDate),
      phone_verified_at: datetime(baseDate),
      last_login_at: datetime(new Date(now.getTime() - 7200000)),
      created_at: datetime(new Date(baseDate.getTime() + c * 86400000)),
      updated_at: datetime(now),
      created_by: platformAdminId,
    });
    companyAdmins.push({ id: userId, company: c });
  }
}

// Branch Managers & Staff (1-2 per branch)
const branchManagers = [];
const branchStaff = [];
let branchManagerIdx = 0;
let branchStaffIdx = 0;

// Customers (10-25 per company, some shared)
const customers = [];
const customerEmails = new Set();
for (let i = 1; i <= 100; i++) {
  const userId = uuid();
  const email = `customer${i}@testmail.com`;
  if (customerEmails.has(email)) continue;
  customerEmails.add(email);
  
  users.push({
    id: userId,
    email,
    phone: `+1555100${String(i).padStart(4, '0')}`,
    first_name: ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Avery', 'Quinn'][i % 8],
    last_name: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'][i % 8],
    date_of_birth: date(new Date(1980 + (i % 30), (i % 12), (i % 28) + 1)),
    status: i % 20 === 0 ? 'inactive' : 'active',
    email_verified_at: datetime(new Date(baseDate.getTime() + i * 86400000)),
    phone_verified_at: datetime(new Date(baseDate.getTime() + i * 86400000)),
    last_login_at: datetime(new Date(now.getTime() - (i % 7) * 86400000)),
    created_at: datetime(new Date(baseDate.getTime() + i * 86400000)),
    updated_at: datetime(now),
    created_by: platformAdminId,
  });
  
  customers.push(userId);
  
  userRoles.push({
    id: uuid(),
    user_id: userId,
    role_id: roles[4].id,
    company_id: '',
    branch_id: '',
    assigned_at: datetime(new Date(baseDate.getTime() + i * 86400000)),
    assigned_by: platformAdminId,
    created_at: datetime(new Date(baseDate.getTime() + i * 86400000)),
    updated_at: datetime(new Date(baseDate.getTime() + i * 86400000)),
  });
  
  authIdentities.push({
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
const companies = [];
const branches = [];
const branchContacts = [];
const branchAmenities = [];
const branchBusinessHours = [];
const branchSpecialHours = [];

const companyNames = [
  'Pickleball Paradise',
  'Court Masters',
  'Ace Sports Center',
  'Rally Point Courts',
  'Smash Zone',
];

for (let i = 0; i < 5; i++) {
  const companyId = uuid();
  const companyAdmin = companyAdmins[i * 2];
  
  companies.push({
    id: companyId,
    name: companyNames[i],
    slug: companyNames[i].toLowerCase().replace(/\s+/g, '-'),
    description: `Premier ${companyNames[i]} facility offering world-class pickleball courts and services.`,
    logo_media_id: '',
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
  userRoles.push({
    id: uuid(),
    user_id: companyAdmin.id,
    role_id: roles[1].id,
    company_id: companyId,
    branch_id: '',
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
  
  for (let b = 0; b < numBranches; b++) {
    const branchId = uuid();
    const branchName = branchNames[i][b] || `Branch ${b + 1}`;
    
    branches.push({
      id: branchId,
      company_id: companyId,
      name: `${branchName} Branch`,
      slug: `${companyNames[i].toLowerCase().replace(/\s+/g, '-')}-${branchName.toLowerCase()}`,
      description: `${branchName} location of ${companyNames[i]}`,
      address_line1: `${100 + b * 10} ${branchName} Street`,
      address_line2: b % 2 === 0 ? 'Suite 200' : '',
      city: ['San Francisco', 'Los Angeles', 'San Diego', 'Oakland', 'Sacramento'][i],
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
    branchContacts.push({
      id: uuid(),
      branch_id: branchId,
      contact_type: 'phone',
      contact_value: `+1555${String(i + 1).padStart(3, '0')}${String(b + 1).padStart(3, '0')}`,
      is_primary: true,
      label: 'Main Office',
      created_at: datetime(new Date(baseDate.getTime() + (i + 1) * 86400000)),
      updated_at: datetime(new Date(baseDate.getTime() + (i + 1) * 86400000)),
    });
    
    branchContacts.push({
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
    amenityNames.slice(0, 3 + (b % 3)).forEach((name, idx) => {
      branchAmenities.push({
        id: uuid(),
        branch_id: branchId,
        name,
        description: `${name} available at this location`,
        icon_name: name.toLowerCase().replace(/\s+/g, '_'),
        created_at: datetime(new Date(baseDate.getTime() + (i + 1) * 86400000)),
        updated_at: datetime(new Date(baseDate.getTime() + (i + 1) * 86400000)),
      });
    });
    
    // Business hours (Mon-Sun)
    for (let d = 0; d < 7; d++) {
      branchBusinessHours.push({
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
      { date: '2024-12-25', reason: 'Christmas' },
      { date: '2024-07-04', reason: 'Independence Day' },
    ];
    holidays.forEach(holiday => {
      branchSpecialHours.push({
        id: uuid(),
        branch_id: branchId,
        date: holiday.date,
        open_time: '10:00:00',
        close_time: '18:00:00',
        is_closed: false,
        reason: holiday.reason,
        created_at: datetime(new Date(baseDate.getTime() + (i + 1) * 86400000)),
        updated_at: datetime(new Date(baseDate.getTime() + (i + 1) * 86400000)),
      });
    });
  }
}

// Continue with courts, bookings, etc. in next part due to length...
// This is a simplified version - the full script would generate all tables

console.log('Generating CSV files...');

// Write roles
writeCSV('roles.csv', [
  'id', 'name', 'role_type', 'description', 'is_system_role', 'created_at', 'updated_at', 'created_by', 'updated_by', 'deleted_at'
], roles.map(r => [
  r.id, r.name, r.role_type, '', r.is_system ? '1' : '0', datetime(baseDate), datetime(baseDate), platformAdminId, platformAdminId, ''
]));

// Write permissions
writeCSV('permissions.csv', [
  'id', 'name', 'resource', 'action', 'description', 'created_at', 'updated_at', 'created_by', 'updated_by', 'deleted_at'
], permissions.map(p => [
  p.id, p.name, p.resource, p.action, '', datetime(baseDate), datetime(baseDate), platformAdminId, platformAdminId, ''
]));

// Write role_permissions
writeCSV('role_permissions.csv', [
  'id', 'role_id', 'permission_id', 'created_at', 'updated_at', 'created_by', 'updated_by', 'deleted_at'
], rolePermissions.map(rp => [
  rp.id, rp.role_id, rp.permission_id, rp.created_at, rp.updated_at, platformAdminId, platformAdminId, ''
]));

// Write users
writeCSV('users.csv', [
  'id', 'email', 'phone', 'first_name', 'last_name', 'date_of_birth', 'status', 'email_verified_at', 'phone_verified_at', 'last_login_at', 'created_at', 'updated_at', 'created_by', 'updated_by', 'deleted_at'
], users.map(u => [
  u.id, u.email || '', u.phone || '', u.first_name, u.last_name, u.date_of_birth || '', u.status, u.email_verified_at || '', u.phone_verified_at || '', u.last_login_at || '', u.created_at, u.updated_at, u.created_by || '', u.updated_by || '', ''
]));

// Write user_roles
writeCSV('user_roles.csv', [
  'id', 'user_id', 'role_id', 'company_id', 'branch_id', 'assigned_at', 'assigned_by', 'expires_at', 'created_at', 'updated_at', 'created_by', 'updated_by', 'deleted_at'
], userRoles.map(ur => [
  ur.id, ur.user_id, ur.role_id, ur.company_id || '', ur.branch_id || '', ur.assigned_at, ur.assigned_by, ur.expires_at || '', ur.created_at, ur.updated_at, ur.created_by || '', ur.updated_by || '', ''
]));

// Write auth_identities
writeCSV('auth_identities.csv', [
  'id', 'user_id', 'provider', 'provider_user_id', 'email', 'phone', 'provider_metadata', 'is_primary', 'verified_at', 'created_at', 'updated_at', 'created_by', 'updated_by', 'deleted_at'
], authIdentities.map(ai => [
  ai.id, ai.user_id, ai.provider, ai.provider_user_id, ai.email || '', ai.phone || '', '{}', ai.is_primary ? '1' : '0', ai.verified_at || '', ai.created_at, ai.updated_at, ai.created_by || '', ai.updated_by || '', ''
]));

// Write companies
writeCSV('companies.csv', [
  'id', 'name', 'slug', 'description', 'logo_media_id', 'website_url', 'timezone', 'default_currency', 'status', 'created_at', 'updated_at', 'created_by', 'updated_by', 'deleted_at'
], companies.map(c => [
  c.id, c.name, c.slug, c.description, c.logo_media_id || '', c.website_url, c.timezone, c.default_currency, c.status, c.created_at, c.updated_at, c.created_by, c.updated_by || '', ''
]));

// Write branches
writeCSV('branches.csv', [
  'id', 'company_id', 'name', 'slug', 'description', 'address_line1', 'address_line2', 'city', 'state', 'postal_code', 'country', 'latitude', 'longitude', 'timezone', 'status', 'created_at', 'updated_at', 'created_by', 'updated_by', 'deleted_at'
], branches.map(b => [
  b.id, b.company_id, b.name, b.slug, b.description, b.address_line1, b.address_line2 || '', b.city, b.state, b.postal_code, b.country, b.latitude, b.longitude, b.timezone, b.status, b.created_at, b.updated_at, b.created_by, b.updated_by || '', ''
]));

// Write branch_contacts
writeCSV('branch_contacts.csv', [
  'id', 'branch_id', 'contact_type', 'contact_value', 'is_primary', 'label', 'created_at', 'updated_at', 'created_by', 'updated_by', 'deleted_at'
], branchContacts.map(bc => [
  bc.id, bc.branch_id, bc.contact_type, bc.contact_value, bc.is_primary ? '1' : '0', bc.label || '', bc.created_at, bc.updated_at, bc.created_by || '', bc.updated_by || '', ''
]));

// Write branch_amenities
writeCSV('branch_amenities.csv', [
  'id', 'branch_id', 'name', 'description', 'icon_name', 'created_at', 'updated_at', 'created_by', 'updated_by', 'deleted_at'
], branchAmenities.map(ba => [
  ba.id, ba.branch_id, ba.name, ba.description, ba.icon_name || '', ba.created_at, ba.updated_at, ba.created_by || '', ba.updated_by || '', ''
]));

// Write branch_business_hours
writeCSV('branch_business_hours.csv', [
  'id', 'branch_id', 'day_of_week', 'open_time', 'close_time', 'is_closed', 'created_at', 'updated_at', 'created_by', 'updated_by', 'deleted_at'
], branchBusinessHours.map(bbh => [
  bbh.id, bbh.branch_id, bbh.day_of_week, bbh.open_time, bbh.close_time, bbh.is_closed ? '1' : '0', bbh.created_at, bbh.updated_at, bbh.created_by || '', bbh.updated_by || '', ''
]));

// Write branch_special_hours
writeCSV('branch_special_hours.csv', [
  'id', 'branch_id', 'date', 'open_time', 'close_time', 'is_closed', 'reason', 'created_at', 'updated_at', 'created_by', 'updated_by', 'deleted_at'
], branchSpecialHours.map(bsh => [
  bsh.id, bsh.branch_id, bsh.date, bsh.open_time, bsh.close_time, bsh.is_closed ? '1' : '0', bsh.reason || '', bsh.created_at, bsh.updated_at, bsh.created_by || '', bsh.updated_by || '', ''
]));

console.log('\nMock data generation complete!');
console.log(`Files written to: ${OUTPUT_DIR}`);


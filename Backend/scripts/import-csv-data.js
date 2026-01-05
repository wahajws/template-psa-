require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { sequelize } = require('../src/models');
const models = require('../src/models');

// CSV parser helper
function parseCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n').filter(line => line.trim());
  if (lines.length < 2) return { headers: [], rows: [] };
  
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const rows = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let j = 0; j < lines[i].length; j++) {
      const char = lines[i][j];
      if (char === '"') {
        if (inQuotes && lines[i][j + 1] === '"') {
          current += '"';
          j++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    
    if (values.length === headers.length) {
      const row = {};
      headers.forEach((header, idx) => {
        let value = values[idx] || '';
        value = value.replace(/^"|"$/g, '');
        
        // Convert empty strings to null
        if (value === '') {
          row[header] = null;
        } else {
          // Try to parse JSON fields
          if (header.includes('metadata') || header.includes('snapshot') || header.includes('json')) {
            try {
              row[header] = JSON.parse(value);
            } catch {
              row[header] = value;
            }
          } else {
            row[header] = value;
          }
        }
      });
      rows.push(row);
    }
  }
  
  return { headers, rows };
}

// Table to model mapping
const tableModelMap = {
  'roles': 'Role',
  'permissions': 'Permission',
  'role_permissions': 'RolePermission',
  'users': 'User',
  'user_roles': 'UserRole',
  'auth_identities': 'AuthIdentity',
  'auth_sessions': 'AuthSession',
  'otp_codes': 'OtpCode',
  'companies': 'Company',
  'branches': 'Branch',
  'branch_contacts': 'BranchContact',
  'branch_amenities': 'BranchAmenity',
  'branch_staff': 'BranchStaff',
  'branch_business_hours': 'BranchBusinessHours',
  'branch_special_hours': 'BranchSpecialHours',
  'courts': 'Court',
  'court_features': 'CourtFeature',
  'court_rate_rules': 'CourtRateRule',
  'court_time_slots': 'CourtTimeSlot',
  'resource_blocks': 'ResourceBlock',
  'services': 'Service',
  'service_branch_availability': 'ServiceBranchAvailability',
  'membership_plans': 'MembershipPlan',
  'membership_plan_benefits': 'MembershipPlanBenefit',
  'customer_memberships': 'CustomerMembership',
  'membership_cycles': 'MembershipCycle',
  'membership_usage_ledger': 'MembershipUsageLedger',
  'campaigns': 'Campaign',
  'campaign_rules': 'CampaignRule',
  'promo_codes': 'PromoCode',
  'discount_applications': 'DiscountApplication',
  'bookings': 'Booking',
  'booking_items': 'BookingItem',
  'booking_participants': 'BookingParticipant',
  'booking_change_log': 'BookingChangeLog',
  'booking_waitlist': 'BookingWaitlist',
  'payments': 'Payment',
  'payment_attempts': 'PaymentAttempt',
  'refunds': 'Refund',
  'invoices': 'Invoice',
  'invoice_items': 'InvoiceItem',
  'customer_wallet_ledger': 'CustomerWalletLedger',
  'gift_cards': 'GiftCard',
  'gift_card_redemptions': 'GiftCardRedemption',
  'media_files': 'MediaFile',
  'media_variants': 'MediaVariant',
  'reviews': 'Review',
  'support_tickets': 'SupportTicket',
  'support_ticket_messages': 'SupportTicketMessage',
  'audit_logs': 'AuditLog',
  'company_customers': 'CompanyCustomer',
  'groups': 'Group',
  'group_members': 'GroupMember',
  'group_bookings': 'GroupBooking',
  'tax_rates': 'TaxRate',
  'notification_templates': 'NotificationTemplate',
  'notifications_outbox': 'NotificationOutbox',
  'notification_delivery_logs': 'NotificationDeliveryLog',
  'user_notification_preferences': 'UserNotificationPreference',
};

// Import order (respecting foreign key dependencies)
const importOrder = [
  'roles',
  'permissions',
  'role_permissions',
  'users',
  'user_roles',
  'auth_identities',
  'auth_sessions',
  'otp_codes',
  'companies',
  'branches',
  'branch_contacts',
  'branch_amenities',
  'branch_staff',
  'branch_business_hours',
  'branch_special_hours',
  'courts',
  'court_features',
  'court_rate_rules',
  'court_time_slots',
  'resource_blocks',
  'services',
  'service_branch_availability',
  'membership_plans',
  'membership_plan_benefits',
  'company_customers',
  'customer_memberships',
  'membership_cycles',
  'membership_usage_ledger',
  'campaigns',
  'campaign_rules',
  'promo_codes',
  'discount_applications',
  'bookings',
  'booking_items',
  'booking_participants',
  'booking_change_log',
  'booking_waitlist',
  'payments',
  'payment_attempts',
  'refunds',
  'invoices',
  'invoice_items',
  'customer_wallet_ledger',
  'gift_cards',
  'gift_card_redemptions',
  'media_files',
  'media_variants',
  'reviews',
  'support_tickets',
  'support_ticket_messages',
  'audit_logs',
  'groups',
  'group_members',
  'group_bookings',
  'tax_rates',
  'notification_templates',
  'notifications_outbox',
  'notification_delivery_logs',
  'user_notification_preferences',
];

async function importCSVData() {
  try {
    await sequelize.authenticate();
    console.log('Database connected. Importing CSV data...\n');
    
    const csvDir = path.join(__dirname, '../../mock-data');
    
    if (!fs.existsSync(csvDir)) {
      console.error(`Error: ${csvDir} directory not found!`);
      process.exit(1);
    }
    
    const transaction = await sequelize.transaction();
    
    try {
      for (const tableName of importOrder) {
        const csvFile = path.join(csvDir, `${tableName}.csv`);
        
        if (!fs.existsSync(csvFile)) {
          console.log(`⚠ Skipping ${tableName}.csv (file not found)`);
          continue;
        }
        
        const modelName = tableModelMap[tableName];
        if (!modelName || !models[modelName]) {
          console.log(`⚠ Skipping ${tableName} (model not found: ${modelName})`);
          continue;
        }
        
        const Model = models[modelName];
        const { headers, rows } = parseCSV(csvFile);
        
        if (rows.length === 0) {
          console.log(`✓ ${tableName}.csv (0 rows - empty file)`);
          continue;
        }
        
        // Convert data types
        const processedRows = rows.map(row => {
          const processed = {};
          Object.keys(row).forEach(key => {
            let value = row[key];
            
            if (value === null || value === '') {
              processed[key] = null;
            } else {
              // Handle boolean fields
              if (value === '1' || value === 'true') {
                processed[key] = true;
              } else if (value === '0' || value === 'false') {
                processed[key] = false;
              } else {
                processed[key] = value;
              }
            }
          });
          return processed;
        });
        
        // Bulk insert in batches
        const batchSize = 100;
        let inserted = 0;
        
        for (let i = 0; i < processedRows.length; i += batchSize) {
          const batch = processedRows.slice(i, i + batchSize);
          await Model.bulkCreate(batch, {
            transaction,
            ignoreDuplicates: true,
            validate: false,
          });
          inserted += batch.length;
        }
        
        console.log(`✓ ${tableName}.csv (${inserted} rows imported)`);
      }
      
      await transaction.commit();
      console.log('\n✓ All CSV data imported successfully!');
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
    
    await sequelize.close();
  } catch (error) {
    console.error('Error importing CSV data:', error);
    process.exit(1);
  }
}

importCSVData();


'use strict';

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const all = require('../src/models');
const sequelize = all.sequelize;

// remove sequelize from models map
const models = { ...all };
delete models.sequelize;

const { generateUUID } = require('../src/utils/uuid');

const SEED_ON = (process.env.AUTO_SEED || 'false').toLowerCase() === 'true';

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
        let value = (values[idx] ?? '').replace(/^"|"$/g, '').trim();

        // treat NULL / empty / \N as null
        if (value === '' || value.toUpperCase() === 'NULL' || value === '\\N') {
          row[header] = null;
          return;
        }

        if (value === '1' || value === 'true') row[header] = true;
        else if (value === '0' || value === 'false') row[header] = false;
        else row[header] = value;
      });

      rows.push(row);
    }
  }

  return { headers, rows };
}

function splitSqlStatements(sqlText) {
  return sqlText
    .split(';')
    .map(s => s.trim())
    .filter(s => {
      if (!s) return false;
      const nonComment = s.split('\n').some(line => {
        const t = line.trim();
        return t.length > 0 && !t.startsWith('--');
      });
      return nonComment;
    });
}

const tableModelMap = {
  users: 'User',
  user_roles: 'UserRole',
  roles: 'Role',
  permissions: 'Permission',
  role_permissions: 'RolePermission',
  auth_identities: 'AuthIdentity',
  auth_sessions: 'AuthSession',
  otp_codes: 'OtpCode',
  companies: 'Company',
  branches: 'Branch',
};

function toPascalCase(s) {
  return s
    .replace(/[_-]/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map(w => w[0].toUpperCase() + w.slice(1))
    .join('');
}

function resolveModelFromCsvBase(base) {
  if (tableModelMap[base]) return models[tableModelMap[base]];
  if (models[base]) return models[base];

  const guess = toPascalCase(base);
  if (models[guess]) return models[guess];

  if (base.endsWith('s')) {
    const singular = base.slice(0, -1);
    if (models[singular]) return models[singular];
    const singularGuess = toPascalCase(singular);
    if (models[singularGuess]) return models[singularGuess];
  }

  return null;
}

// ---- IMPORTANT: make FK-safe order
function seedFileSort(a, b) {
  const order = ['User.csv', 'AuthIdentity.csv', 'UserRole.csv'];
  const ai = order.indexOf(a);
  const bi = order.indexOf(b);
  return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
}

async function runSqlFiles(sqlDir) {
  if (!fs.existsSync(sqlDir)) return;

  const sqlFiles = fs.readdirSync(sqlDir).filter(f => f.endsWith('.sql'));
  for (const file of sqlFiles) {
    const full = path.join(sqlDir, file);
    console.log(`Running SQL: ${file}`);

    const text = fs.readFileSync(full, 'utf8');
    const statements = splitSqlStatements(text);

    for (let i = 0; i < statements.length; i++) {
      try {
        await sequelize.query(statements[i]);
      } catch (e) {
        console.log(`SQL statement failed (continuing): ${file} #${i + 1}`);
        console.log(e.message);
      }
    }
  }
}

function ensureIdIfMissing(Model, row) {
  // If model has id attribute and row.id missing, generate UUID
  if (Model?.rawAttributes?.id && (row.id === null || row.id === undefined || row.id === '')) {
    row.id = generateUUID();
  }
  return row;
}

// ✅ THIS is the key: create auth identities after users are inserted
async function ensureAuthIdentitiesFromUsers(userRows, tx) {
  if (!models.AuthIdentity) {
    console.log('⚠️ AuthIdentity model not found. Skipping identity generation.');
    return;
  }

  for (const r of userRows) {
    const email = r.email || null;
    const phone = r.phone || null;
    const password = r.password || null;

    if (!password) continue;
    if (!email && !phone) continue;

    // find the real user id from DB (because CSV doesn't contain user id)
    const user = await models.User.findOne({
      where: email ? { email } : { phone },
      transaction: tx
    });

    if (!user) continue;

    const passwordHash = await bcrypt.hash(password, 10);
    const providerUserId = email || phone;

    // Upsert-like logic (create if not exists)
    const existing = await models.AuthIdentity.findOne({
      where: {
        user_id: user.id,
        provider: 'email_password'
      },
      transaction: tx
    });

    const payload = {
      ...(existing ? {} : { id: generateUUID() }),
      user_id: user.id,
      provider: 'email_password',
      provider_user_id: providerUserId,
      email,
      phone,
      is_primary: true,
      verified_at: new Date(),
      provider_metadata: { password_hash: passwordHash }
    };

    if (existing) {
      await existing.update(payload, { transaction: tx });
    } else {
      await models.AuthIdentity.create(payload, { transaction: tx });
    }
  }

  console.log('✅ AuthIdentity seeded (password hash created for login)');
}

async function runCsvSeed(csvDir) {
  if (!fs.existsSync(csvDir)) {
    console.log(`CSV seed folder not found: ${csvDir}`);
    return;
  }

  let csvFiles = fs.readdirSync(csvDir).filter(f => f.toLowerCase().endsWith('.csv'));
  if (csvFiles.length === 0) {
    console.log(`No CSV files inside: ${csvDir}`);
    return;
  }

  // FK-safe order
  csvFiles.sort(seedFileSort);

  for (const file of csvFiles) {
    const full = path.join(csvDir, file);
    const base = file.substring(0, file.length - 4);

    const Model = resolveModelFromCsvBase(base);
    if (!Model) {
      console.log(`Skipping ${file} (no matching Sequelize model found)`);
      continue;
    }

    const { rows } = parseCSV(full);
    if (!rows.length) {
      console.log(`${file} (0 rows)`);
      continue;
    }

    console.log(`Seeding ${file} → model ${Model.name} (${rows.length} rows)`);

    const tx = await sequelize.transaction();
    try {
      const fixedRows = rows.map(r => ensureIdIfMissing(Model, { ...r }));

      await Model.bulkCreate(fixedRows, {
        transaction: tx,
        validate: false,
        individualHooks: true
      });

      // Special: after inserting users, generate auth identities from their CSV passwords
      if (Model.name === 'User') {
        await ensureAuthIdentitiesFromUsers(rows, tx);
      }

      await tx.commit();
      console.log(`Done: ${file}`);
    } catch (e) {
      await tx.rollback();
      console.log(`Failed: ${file}`);
      console.log(e.message);
    }
  }
}

async function seedAuto() {
  if (!SEED_ON) {
    console.log('⏭️ AUTO_SEED is false. Skipping auto seed.');
    return;
  }

  await sequelize.authenticate();
  console.log('DB connected:', sequelize.config.database);

  await runSqlFiles(path.join(__dirname, 'seed-data-sql'));
  await runCsvSeed(path.join(__dirname, 'seed-data-csv'));

  console.log('Auto seed completed');
}

module.exports = seedAuto;

if (require.main === module) {
  seedAuto().catch((e) => {
    console.log('Auto seed failed:', e.message);
    process.exit(1);
  });
}

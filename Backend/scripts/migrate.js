require('dotenv').config();
const { Umzug, SequelizeStorage } = require('umzug');
const { sequelize } = require('../src/models');
const path = require('path');

const umzug = new Umzug({
  migrations: {
    glob: path.join(__dirname, '../src/migrations/*.js'),
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});

const command = process.argv[2];

(async () => {
  try {
    if (command === '--undo') {
      await umzug.down();
      console.log('Migrations rolled back');
    } else {
      await umzug.up();
      console.log('Migrations executed');
    }
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
})();


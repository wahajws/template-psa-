require('dotenv').config();
const app = require('./app');
const config = require('./src/config/env');
const logger = require('./src/config/logger');
const { sequelize } = require('./src/models');

//For bootstarp Seed
function runNodeScript(scriptPath) {
  return new Promise((resolve, reject) => {
    const p = spawn(process.execPath, [scriptPath], { stdio: 'inherit' });

    p.on('close', (code) => {
      if (code === 0) return resolve();
      reject(new Error(`Seed script failed: ${scriptPath} (exit ${code})`));
    });

    p.on('error', reject);
  });
}

async function runBootstrapSeedIfEnabled() {
  // Only run in dev if explicitly enabled
  const isDev = (process.env.NODE_ENV || 'development') === 'development';
  const seedOn = (process.env.AUTO_SEED || 'false').toLowerCase() === 'true';

  if (!isDev || !seedOn) {
    logger.info('Auto seed skipped (NODE_ENV != development OR AUTO_SEED != true)');
    return;
  }

  const bootstrapScript = path.join(__dirname, 'scripts-working', 'bootstrap.js');
  const seedAllScript = path.join(__dirname, 'scripts-working', 'seed-all.js'); // or seed.js or seed:all file

  logger.info('AUTO_SEED enabled → Running bootstrap seed...');
  await runNodeScript(bootstrapScript);
  await runNodeScript(seedAllScript);
  logger.info('Bootstrap seed completed');
}

async function startServer() {
  try {
    await sequelize.authenticate();
    logger.info('Database connection established');

    const server = app.listen(config.PORT, () => {
      logger.info(`Server running on port ${config.PORT}`);
    });

    process.on('SIGTERM', async () => {
      logger.info('SIGTERM received, shutting down gracefully');
      server.close(() => {
        sequelize.close();
        process.exit(0);
      });
    });
  } catch (error) {
    logger.error('Unable to start server:', error);
    process.exit(1);
  }
}

startServer();



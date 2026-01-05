require('dotenv').config();
const app = require('./app');
const config = require('./src/config/env');
const logger = require('./src/config/logger');
const { sequelize } = require('./src/models');
const { User } = require('./src/models');

const SYSTEM_USER_ID = '00000000-0000-0000-0000-000000000000';

async function ensureSystemUser() {
  try {
    let systemUser = await User.findByPk(SYSTEM_USER_ID);
    if (!systemUser) {
      logger.info('Creating system user for activity logging...');
      try {
        systemUser = await User.create({
          id: SYSTEM_USER_ID,
          email: 'system@platform.com',
          first_name: 'System',
          last_name: 'User',
          status: 'active',
          created_by: null // System user doesn't have a creator
        });
        logger.info('System user created successfully');
      } catch (createError) {
        // If creation fails, check if it was created by another process (race condition)
        systemUser = await User.findByPk(SYSTEM_USER_ID);
        if (!systemUser) {
          logger.error('Failed to create system user:', createError.message);
          throw createError; // Re-throw if it still doesn't exist
        } else {
          logger.info('System user exists (created by another process)');
        }
      }
    } else {
      logger.debug('System user already exists');
    }
  } catch (error) {
    logger.error('CRITICAL: Could not ensure system user exists:', error.message);
    logger.error('The server may experience errors with activity logging.');
    // Don't fail startup, but log the error clearly
  }
}

async function startServer() {
  try {
    await sequelize.authenticate();
    logger.info('Database connection established');

    // Ensure system user exists
    await ensureSystemUser();

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




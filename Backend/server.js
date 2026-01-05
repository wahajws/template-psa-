require('dotenv').config();
const app = require('./app');
const config = require('./src/config/env');
const logger = require('./src/config/logger');
const { sequelize } = require('./src/models');

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



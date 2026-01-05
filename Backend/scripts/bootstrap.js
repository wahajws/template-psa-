require('dotenv').config();
const mysql = require('mysql2/promise');
const config = require('../src/config/env');
const { sequelize } = require('../src/models');
const logger = require('../src/config/logger');

async function bootstrap() {
  try {
    const connection = await mysql.createConnection({
      host: config.DB_HOST,
      port: config.DB_PORT,
      user: config.DB_USER,
      password: config.DB_PASSWORD
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${config.DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    await connection.end();

    logger.info(`Database ${config.DB_NAME} created or already exists`);

    await sequelize.authenticate();
    logger.info('Database connection established');

    await sequelize.sync({ alter: false });
    logger.info('Database schema synced');

    process.exit(0);
  } catch (error) {
    logger.error('Bootstrap error:', error);
    process.exit(1);
  }
}

bootstrap();


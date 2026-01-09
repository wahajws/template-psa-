const dbConfig = require('../config/dbConfig');
const { Sequelize } = require('sequelize');
require('dotenv').config();

const dbSequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    pool: dbConfig.pool
  }
);

module.exports = dbSequelize;

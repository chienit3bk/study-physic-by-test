// CommonJS config consumed by sequelize-cli (migrations & seeders).
// The application itself reads its DB config from src/config/database.ts.
require('dotenv').config();

const base = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD || null,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 5432,
  dialect: 'postgres',
};

module.exports = {
  development: base,
  test: base,
  production: base,
};

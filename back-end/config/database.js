require('dotenv').config();

export const PGS_DATABASE_CONFIG = {
  logging: true,
  dialect: 'postgres',
  host: process.env.HOST || 'localhost',
  user: process.env.USER || postgres,
  database: process.env.USER || 'study_physic_by_test',
  password: process.env.PASSWORD || null,
  port: process.env.PORT || 5432,
}

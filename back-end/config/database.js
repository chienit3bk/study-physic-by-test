require('dotenv').config();

export const PGS_DATABASE_CONFIG = {
  logging: true,
  dialect: 'postgres',
  host: process.env.DB_HOST || 'physic-test-postgres',
  user: process.env.DB_USERNAME || 'study_physic_by_test',
  database: process.env.DB_DATABASE || 'study_physic_by_test',
  password: process.env.DB_PASSWORD || null,
  port: process.env.DB_PORT || 5432,
}

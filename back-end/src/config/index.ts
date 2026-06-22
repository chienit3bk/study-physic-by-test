import dotenv from 'dotenv';

dotenv.config();

const env = process.env.NODE_ENV ?? 'development';

export const config = {
  app: {
    port: Number(process.env.PORT ?? process.env.DEV_APP_PORT ?? 3000),
    name: process.env.APP_NAME ?? 'iLrn',
    env,
    isDev: env === 'development',
  },
  db: {
    host: process.env.DB_HOST ?? '127.0.0.1',
    port: Number(process.env.DB_PORT ?? 5432),
    database: process.env.DB_DATABASE ?? 'study_physic_by_test',
    username: process.env.DB_USERNAME ?? 'study_physic_by_test',
    password: process.env.DB_PASSWORD ?? undefined,
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET ?? '',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '1d',
    saltRounds: Number(process.env.SALT_ROUND ?? 10),
    refreshTokenSecret:
      process.env.REFRESH_TOKEN_SECRET ?? 'VmVyeVBvd2VyZnVsbFNlY3JldA==',
    refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN ?? '2d',
  },
} as const;

export type AppConfig = typeof config;

export default config;

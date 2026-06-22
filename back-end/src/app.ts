import http from 'node:http';
import app from './server';
import { config } from './config';
import { sequelize } from './models';
import { logger } from './utils/logger';

const server = http.createServer(app);

async function start(): Promise<void> {
  try {
    await sequelize.authenticate();
    logger.info('Database connection established');
  } catch (error) {
    logger.error(`Unable to connect to the database: ${String(error)}`);
  }

  if (!config.auth.jwtSecret) {
    logger.error("JWT_SECRET is not set - set it in .env before accepting traffic.");
  }

  server.listen(config.app.port, () => {
    logger.info(`${config.app.name} API listening on port ${config.app.port}`);
  });
}

void start();

export { server };

import type { Options } from 'sequelize';
import { config } from './index';

export const databaseConfig: Options = {
  dialect: 'postgres',
  host: config.db.host,
  port: config.db.port,
  database: config.db.database,
  username: config.db.username,
  password: config.db.password,
  logging: config.app.isDev ? (msg: string) => console.log(msg) : false,
  define: {
    // Sequelize adds createdAt/updatedAt by default; keep timestamps on.
    timestamps: true,
  },
};

export default databaseConfig;

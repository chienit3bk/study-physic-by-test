import express from 'express';
import cors from 'cors';
import { config } from './config';
import db from './models';
import router from './routes';
import { requestLogger } from './middleware/requestLogger';

export const app = express();

app.set('config', config);
app.set('db', db);
app.set('port', config.app.port);

app.use(express.json());
app.use(cors());
app.use(requestLogger);

app.get('/health', (_req, res) => {
  res.status(200).send({ status: 'ok', name: config.app.name, env: config.app.env });
});

app.use(router);

export default app;

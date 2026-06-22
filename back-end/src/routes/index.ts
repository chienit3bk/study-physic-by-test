import { Router } from 'express';
import apiRouter from './api';
import webRouter from './web';
import { auth } from '../middleware/auth';

const router = Router();

// All /api routes require a valid JWT.
router.use('/api', auth, apiRouter);
// Public web routes (login, sign-up, token refresh).
router.use('/', webRouter);

export default router;

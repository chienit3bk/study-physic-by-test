import { Router } from 'express';
import { AuthController } from '../../controllers/AuthController';

const router = Router();

router.post('/sign-up', AuthController.signUp);
router.post('/login', AuthController.login);
router.get('/refresh', AuthController.refreshToken);

export default router;

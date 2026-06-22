import { Router } from 'express';
import { admin } from '../../middleware/admin';
import { UserController } from '../../controllers/UserController';

const router = Router();

router.get('/:id', UserController.getUserById);
router.get('/', admin, UserController.getList);

export default router;

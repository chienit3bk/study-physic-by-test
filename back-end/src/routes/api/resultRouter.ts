import { Router } from 'express';
import { ResultController } from '../../controllers/ResultController';

const router = Router();

router.get('/', ResultController.getList);
router.post('/', ResultController.create);

export default router;

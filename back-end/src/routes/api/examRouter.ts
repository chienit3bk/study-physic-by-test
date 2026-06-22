import { Router } from 'express';
import { ExamController } from '../../controllers/ExamController';

const router = Router();

router.post('/', ExamController.generate);
router.get('/', ExamController.getList);
router.get('/:id', ExamController.getById);

export default router;

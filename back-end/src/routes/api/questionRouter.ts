import { Router } from 'express';
import { QuestionController } from '../../controllers/QuestionController';

const router = Router();

router.post('/list', QuestionController.getListById);
router.get('/:id', QuestionController.getById);
router.post('/', QuestionController.create);
router.get('/', QuestionController.getList);
router.put('/:id', QuestionController.updateById);
router.delete('/:id', QuestionController.deleteById);

export default router;

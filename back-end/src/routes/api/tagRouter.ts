import { Router } from 'express';
import { TagController } from '../../controllers/TagController';

const router = Router();

router.get('/:id', TagController.getById);
router.post('/', TagController.create);
router.get('/', TagController.getList);
router.put('/:id', TagController.updateById);
router.delete('/:id', TagController.deleteById);

export default router;

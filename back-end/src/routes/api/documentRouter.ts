import { Router } from 'express';
import { DocumentController } from '../../controllers/DocumentController';

const router = Router();

router.get('/:id', DocumentController.getById);
router.post('/', DocumentController.create);
router.get('/', DocumentController.getList);
router.put('/:id', DocumentController.updateById);
router.delete('/:id', DocumentController.deleteById);

export default router;

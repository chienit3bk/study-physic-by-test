const router = require('express').Router();
const TagController = require('../../controllers/TagController');

router.get('/:id', TagController.getById);
router.post('/', TagController.create);
router.get('/', TagController.getList);
router.put('/:id', TagController.updateById);
router.delete('/:id', TagController.deleteById);

module.exports = router;

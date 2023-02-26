const router = require('express').Router();
const DocumentController = require('../../controllers/DocumentController');

router.get('/:id([0-9])', DocumentController.getById);
router.post('/', DocumentController.create);
router.get('/', DocumentController.getList);
router.put('/:id([0-9])', DocumentController.updateById);
router.delete('/:id([0-9])', DocumentController.deleteById);

module.exports = router;

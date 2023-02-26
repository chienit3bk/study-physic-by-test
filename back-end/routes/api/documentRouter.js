const router = require('express').Router();
const DocumentController = require('../../controllers/DocumentController');

router.get('/:id([0-9])', DocumentController.getById);
router.post('/', DocumentController.create);
router.get('/', DocumentController.getList);

module.exports = router;

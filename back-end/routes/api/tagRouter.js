const router = require('express').Router();
const TagController = require('../../controllers/TagController');

router.get('/:id([0-9])', TagController.getById);
router.post('/', TagController.create);
router.get('/', TagController.getList);

module.exports = router;

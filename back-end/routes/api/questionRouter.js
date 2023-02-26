const router = require('express').Router();
const QuestionController = require('../../controllers/QuestionController');

router.get('/:id([0-9])', QuestionController.getById);
router.post('/', QuestionController.create);
router.get('/', QuestionController.getList);
router.put('/:id([0-9])', QuestionController.updateById);

module.exports = router;

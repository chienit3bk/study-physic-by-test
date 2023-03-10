const router = require('express').Router();
const QuestionController = require('../../controllers/QuestionController');

router.get('/:id', QuestionController.getById);
router.post('/', QuestionController.create);
router.get('/', QuestionController.getList);
router.put('/:id', QuestionController.updateById);
router.delete('/:id', QuestionController.deleteById);
router.post('/list', QuestionController.getListById);

module.exports = router;

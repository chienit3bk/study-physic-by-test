const router = require('express').Router();
const QuestionController = require('../../controllers/QuestionController');

router.get('/:id([0-9])', QuestionController.getById);
router.post('/', QuestionController.create);
router.get('/', QuestionController.getList);
router.post('/:id([0-9])/attach', QuestionController.attachTags);

module.exports = router;

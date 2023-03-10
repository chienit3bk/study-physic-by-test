const router = require('express').Router();
const ExamController = require('../../controllers/ExamController');

router.post('/', ExamController.generate);
router.get('/', ExamController.getList);
router.get('/:id', ExamController.getById);
module.exports = router;

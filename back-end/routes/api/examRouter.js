const router = require('express').Router();
const ExamController = require('../../controllers/ExamController');

router.post('/', ExamController.generate);

module.exports = router;

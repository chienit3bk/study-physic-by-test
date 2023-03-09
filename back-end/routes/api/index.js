const router = require('express').Router();

// router.use('/', require('./auth.js'));
router.use('/users', require('./userRouter'));
router.use('/questions', require('./questionRouter'));
router.use('/exams', require('./examRouter'));
router.use('/tags', require('./tagRouter'));
router.use('/documents', require('./documentRouter'));
router.use('/results', require('./resultRouter'));

module.exports = router;

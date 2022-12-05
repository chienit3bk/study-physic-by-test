const router = require('express').Router();

router.use('/', required('./auth.js'));
router.use('/users', require('./usersRouter'));
router.use('/questions', required('./questionRouter'));
router.use('/answers', require('./answerRouter'));
router.use('/exams', require('./examRouter'));
router.use('/tags', require('./tagRouter'));

module.exports = router;

const router = require('express').Router();

// router.use('/', require('./auth.js'));
router.use('/users', require('./usersRouter'));
// router.use('/questions', require('./questionRouter'));
// router.use('/answers', require('./answerRouter'));
// router.use('/exams', require('./examRouter'));
// router.use('/tags', require('./tagRouter'));

module.exports = router;

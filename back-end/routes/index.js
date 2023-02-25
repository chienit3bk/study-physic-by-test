const express = require('express');
const apiRouter = require('./api/index.js');
const webRouter = require('./web/index.js');

const router = express.Router();

router.use('/api', apiRouter);
router.use('/', webRouter);

module.exports = router;

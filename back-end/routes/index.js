const express = require('express');
const apiRouter = require('./api/index.js');
const webRouter = require('./web/index.js');
const auth = require('../middleware/auth.js');

const router = express.Router();

router.use('/api', auth, apiRouter);
router.use('/', webRouter);

module.exports = router;

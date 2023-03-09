const router = require('express').Router();

const ResultController = require('../../controllers/ResultController');

router.get('/', ResultController.getList);
router.post('/', ResultController.create);

module.exports = router;

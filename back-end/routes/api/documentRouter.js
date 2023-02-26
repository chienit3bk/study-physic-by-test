const router = require('express').Router();
const DocumentController = require('../../controllers/DocumentController');

router.get('/:id([0-9])', DocumentController.getDocumentById);
router.post('/', DocumentController.createDocument);

module.exports = router;

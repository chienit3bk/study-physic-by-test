const router = require('express').Router();
const UserController = require('../../controllers/UserController');

// router.get('/:id([0-9])', auth.isAuthenticated, UserController.getUserById);
router.get('/:id([0-9])', UserController.getUserById);
// router.delete('/:id([0-9])', UserController.deleteById);

module.exports = router;

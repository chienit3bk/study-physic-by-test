const router = require('express').Router();
const UsersController = require('../../controllers/UsersController');

// router.get('/:id([0-9])', auth.isAuthenticated, UsersController.getUserById);
router.get('/:id([0-9])', UsersController.getUserById);
// router.delete('/:id([0-9])', UsersController.deleteById);

module.exports = router;

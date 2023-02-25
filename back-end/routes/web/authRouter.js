const route = require('express').Router();
const AuthController = require('../../controllers/AuthController');

route.post('/sign-up', AuthController.signUp);
route.post('/login', AuthController.login);
route.get('/refresh', AuthController.refreshToken);

module.exports = route;

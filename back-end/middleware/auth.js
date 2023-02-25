const jwt = require('jsonwebtoken');
const config = require('../config/appconfig');

module.exports = function (req, res, next) {
  try {
    if (!req.headers.authorization) {
      res.status(400).send('Invalid token');
      return;
    }
    const Bearer = req.headers.authorization.split(' ')[0];

    if (!Bearer || Bearer !== 'Bearer') {
      res.status(400).send('Invalid token');
      return;
    }

    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
      res.status(400).send('Invalid token');
      return;
    }

    jwt.verify(token, config.auth.jwt_secret, (err, decoded) => {
      if (err) {
        res.status(400).send('Invalid token');
        return;
      }
      const { payload } = decoded;
      req.user = payload;
      next();
    });
  } catch (err) {
    res.status(500).send('Somethings went wrong, please contact our support');
  }
}

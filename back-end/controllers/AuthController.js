const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const config = require('../config/appconfig');
const BaseController = require('./BaseController');

class AuthController extends BaseController {
    static async login(req, res) {
        try {
            const options = {
                where: { email: req.body.email },
            };
            const user = await super.getByCustomOptions(req, 'User', options);
            if (!user) {
                res.status(400).send('Invalid');
                return;
            }

            const checkPasswordResult = await bcrypt.compare(req.body.password, user.password);
            if (!checkPasswordResult) {
                res.status(400).send('Invalid');
                return;
            }

            req.params.id = user.id;
            const payload = {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            }
            const token = jwt.sign({ payload }, config.auth.jwt_secret, { expiresIn: config.auth.jwt_expiresin, algorithm: 'HS512' });
            res.status(200).send({ token });
        } catch (error) {
            res.status(500).send('Somethings went wrong, please contact our support');
        }
    }

    static async signUp(req, res) {
        try {
            const data = req.body;
            data.password = bcrypt.hashSync(data.password?.toString(), config.auth.saltRounds);
            const createdUser = await super.create(req, 'User');
            if (!createdUser) {
                res.status(500).send('Sign up failed, please try again in a few minutes');
            } else {
                res.status(200).send(_.pick(createdUser, [
                    'id',
                    'name',
                    'email',
                    'phone',
                    'address',
                    'role',
                    'level',
                    'createdAt',
                    'updatedAt',
                ]));
            }
        } catch (err) {
            console.log(err);
            res.status(500).send('Somethings went wrong, please contact our support');
        }
    }

    static async refreshToken(req, res) {
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

            jwt.verify(token, config.auth.jwt_secret, {
                clockTimestamp: 60 * 60 * 24, // Allow refresh with less than 1 day expired token
            }, (err, decoded) => {
                if (err) {
                    res.status(400).send('Invalid token');
                    return;
                }
                req.decoded = decoded;
                const { payload } = req.decoded;
                const token = jwt.sign({ payload }, config.auth.jwt_secret, { expiresIn: config.auth.jwt_expiresin, algorithm: 'HS512' });
                res.status(200).send({ token });
            });
        } catch (err) {
            res.status(500).send('Somethings went wrong, please contact our support');
        }
    }
}

module.exports = AuthController;
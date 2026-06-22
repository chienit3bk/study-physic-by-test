import bcrypt from 'bcrypt';
import jwt, { type SignOptions } from 'jsonwebtoken';
import _ from 'lodash';
import type { Request, Response } from 'express';
import { config } from '../config';
import { crud } from './BaseController';
import type { User } from '../models';
import type { JwtUserPayload } from '../types/express';
import { sendError } from '../utils/http';

const PUBLIC_USER_FIELDS = [
  'id',
  'name',
  'email',
  'phone',
  'address',
  'role',
  'level',
  'createdAt',
  'updatedAt',
] as const;

function signAccessToken(payload: JwtUserPayload): string {
  const options: SignOptions = {
    expiresIn: config.auth.jwtExpiresIn as SignOptions['expiresIn'],
    algorithm: 'HS512',
  };
  return jwt.sign({ payload }, config.auth.jwtSecret, options);
}

export class AuthController {
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const user = (await crud.getByCustomOptions(req, 'User', {
        where: { email: req.body.email },
      })) as User | null;

      if (!user) {
        res.status(400).send({ message: 'Invalid email or password' });
        return;
      }

      const passwordMatches = await bcrypt.compare(String(req.body.password ?? ''), user.password);
      if (!passwordMatches) {
        res.status(400).send({ message: 'Invalid email or password' });
        return;
      }

      const token = signAccessToken({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
      res.status(200).send({ token });
    } catch (error) {
      sendError(res, error);
    }
  }

  static async signUp(req: Request, res: Response): Promise<void> {
    try {
      req.body.password = bcrypt.hashSync(String(req.body.password ?? ''), config.auth.saltRounds);
      const createdUser = (await crud.create(req, 'User')) as User;

      if (!createdUser) {
        res.status(500).send({ message: 'Sign up failed, please try again in a few minutes' });
        return;
      }

      res.status(200).send(_.pick(createdUser, PUBLIC_USER_FIELDS));
    } catch (error) {
      sendError(res, error);
    }
  }

  static async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const header = req.headers.authorization;
      if (!header) {
        res.status(400).send({ message: 'Invalid token' });
        return;
      }

      const [scheme, token] = header.split(' ');
      if (scheme !== 'Bearer' || !token) {
        res.status(400).send({ message: 'Invalid token' });
        return;
      }

      jwt.verify(token, config.auth.jwtSecret, { ignoreExpiration: true }, (err, decoded) => {
        if (err || !decoded || typeof decoded === 'string') {
          res.status(400).send({ message: 'Invalid token' });
          return;
        }
        const payload = (decoded as { payload: JwtUserPayload }).payload;
        res.status(200).send({ token: signAccessToken(payload) });
      });
    } catch (error) {
      sendError(res, error);
    }
  }
}

export default AuthController;

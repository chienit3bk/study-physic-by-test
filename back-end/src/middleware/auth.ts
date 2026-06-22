import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import type { JwtUserPayload } from '../types/express';

/** Verifies the Bearer JWT and attaches the payload to req.user. */
export function auth(req: Request, res: Response, next: NextFunction): void {
  try {
    const header = req.headers.authorization;
    if (!header) {
      res.status(401).send({ message: 'Invalid token' });
      return;
    }

    const [scheme, token] = header.split(' ');
    if (scheme !== 'Bearer' || !token) {
      res.status(401).send({ message: 'Invalid token' });
      return;
    }

    jwt.verify(token, config.auth.jwtSecret, (err, decoded) => {
      if (err || !decoded || typeof decoded === 'string') {
        res.status(401).send({ message: 'Invalid token' });
        return;
      }
      req.user = (decoded as { payload: JwtUserPayload }).payload;
      next();
    });
  } catch {
    res.status(500).send({ message: 'Something went wrong, please contact our support' });
  }
}

export default auth;

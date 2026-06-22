import type { Db } from '../models';

/** Shape of the JWT payload we sign and verify. */
export interface JwtUserPayload {
  id: number;
  name: string;
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      /** Authenticated user, populated by the auth middleware. */
      user?: JwtUserPayload;
      /** Raw decoded token, used by refresh-token flow. */
      decoded?: { payload: JwtUserPayload } & Record<string, unknown>;
    }
    interface Application {
      get(name: 'db'): Db;
      get(name: string): unknown;
    }
  }
}

export {};

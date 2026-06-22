import type { Request, Response, NextFunction } from 'express';

/** Allows the request through only for users with the admin role. */
export function admin(req: Request, res: Response, next: NextFunction): void {
  if (req.user?.role !== 'admin') {
    res.status(403).send({ message: 'No permission' });
    return;
  }
  next();
}

export default admin;

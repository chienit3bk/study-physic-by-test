import _ from 'lodash';
import type { Request, Response } from 'express';
import { crud } from './BaseController';
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

export class UserController {
  static async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const result = await crud.getById(req, 'User');
      res.status(200).send(result ? _.pick(result, PUBLIC_USER_FIELDS) : {});
    } catch (error) {
      sendError(res, error);
    }
  }

  static async deleteById(req: Request, res: Response): Promise<void> {
    try {
      const result = await crud.deleteById(req, 'User');
      res.status(200).send({ deleted: result });
    } catch (error) {
      sendError(res, error);
    }
  }

  static async getList(req: Request, res: Response): Promise<void> {
    try {
      const result = await crud.getList(req, 'User');
      res.status(200).send(result);
    } catch (error) {
      sendError(res, error);
    }
  }
}

export default UserController;

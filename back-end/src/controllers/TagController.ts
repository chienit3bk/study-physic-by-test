import type { Request, Response } from 'express';
import { crud } from './BaseController';
import { sendError } from '../utils/http';

export class TagController {
  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const result = await crud.getById(req, 'Tag');
      res.status(200).send(result);
    } catch (error) {
      sendError(res, error);
    }
  }

  static async getList(req: Request, res: Response): Promise<void> {
    try {
      const result = await crud.getList(req, 'Tag');
      res.status(200).send(result);
    } catch (error) {
      sendError(res, error);
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    try {
      const createdTag = await crud.create(req, 'Tag');
      res.status(200).send(createdTag);
    } catch (error) {
      sendError(res, error);
    }
  }

  static async updateById(req: Request, res: Response): Promise<void> {
    try {
      const result = await crud.updateById(req, 'Tag', req.body);
      res.status(200).send({ affected: result[0] });
    } catch (error) {
      sendError(res, error);
    }
  }

  static async deleteById(req: Request, res: Response): Promise<void> {
    try {
      const result = await crud.deleteById(req, 'Tag');
      res.status(200).send({ deleted: result });
    } catch (error) {
      sendError(res, error);
    }
  }
}

export default TagController;

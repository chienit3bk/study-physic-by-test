import type { Request, Response } from 'express';
import { crud } from './BaseController';
import { Document, Tag } from '../models';
import { sendError } from '../utils/http';

export class DocumentController {
  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const result = await Document.findOne({ where: { id: req.params.id }, include: Tag });
      res.status(200).send(result);
    } catch (error) {
      sendError(res, error);
    }
  }

  static async getList(req: Request, res: Response): Promise<void> {
    try {
      const result = await crud.getList(req, 'Document', { include: Tag });
      res.status(200).send(result);
    } catch (error) {
      sendError(res, error);
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    try {
      const createdDocument = (await crud.create(req, 'Document')) as Document;
      await DocumentController.attachTags(req, createdDocument);
      res.status(200).send(createdDocument);
    } catch (error) {
      sendError(res, error);
    }
  }

  static async updateById(req: Request, res: Response): Promise<void> {
    try {
      const result = await crud.updateById(req, 'Document', req.body);
      const document = await Document.findByPk(String(req.params.id));
      if (document) {
        await DocumentController.attachTags(req, document);
      }
      res.status(200).send({ affected: result[0] });
    } catch (error) {
      sendError(res, error);
    }
  }

  static async deleteById(req: Request, res: Response): Promise<void> {
    try {
      const result = await crud.deleteById(req, 'Document');
      res.status(200).send({ deleted: result });
    } catch (error) {
      sendError(res, error);
    }
  }

  private static async attachTags(req: Request, document: Document): Promise<void> {
    const tagIds = req.body.tagIds;
    if (Array.isArray(tagIds)) {
      const tags = await Tag.findAll({ where: { id: tagIds } });
      await document.setTags(tags);
    }
  }
}

export default DocumentController;

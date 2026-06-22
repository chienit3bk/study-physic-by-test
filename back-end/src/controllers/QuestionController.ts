import type { Request, Response } from 'express';
import type { FindOptions } from 'sequelize';
import { crud } from './BaseController';
import { Question, Tag } from '../models';
import { sendError } from '../utils/http';

export class QuestionController {
  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const result = await Question.findOne({ where: { id: req.params.id }, include: Tag });
      res.status(200).send(result);
    } catch (error) {
      sendError(res, error);
    }
  }

  static async getListById(req: Request, res: Response): Promise<void> {
    try {
      const ids = req.body.ids;
      const questions = await Question.findAll({ include: Tag, where: { id: ids } });
      res.status(200).send(questions);
    } catch (error) {
      sendError(res, error);
    }
  }

  static async getList(req: Request, res: Response): Promise<void> {
    try {
      const mainTag = req.query.mainTag;
      const options: FindOptions = { include: Tag };
      if (typeof mainTag === 'string' && mainTag.length > 0) {
        options.where = { mainTag };
      }
      const result = await crud.getList(req, 'Question', options);
      res.status(200).send(result);
    } catch (error) {
      sendError(res, error);
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    try {
      const createdQuestion = (await crud.create(req, 'Question')) as Question;
      await QuestionController.attachTags(req, createdQuestion);
      res.status(200).send(createdQuestion);
    } catch (error) {
      sendError(res, error);
    }
  }

  static async updateById(req: Request, res: Response): Promise<void> {
    try {
      const result = await crud.updateById(req, 'Question', req.body);
      const question = await Question.findByPk(String(req.params.id));
      if (question) {
        await QuestionController.attachTags(req, question);
      }
      res.status(200).send({ affected: result[0] });
    } catch (error) {
      sendError(res, error);
    }
  }

  static async deleteById(req: Request, res: Response): Promise<void> {
    try {
      const result = await crud.deleteById(req, 'Question');
      res.status(200).send({ deleted: result });
    } catch (error) {
      sendError(res, error);
    }
  }

  private static async attachTags(req: Request, question: Question): Promise<void> {
    const tagIds = req.body.tagIds;
    if (Array.isArray(tagIds)) {
      const tags = await Tag.findAll({ where: { id: tagIds } });
      await question.setTags(tags);
    }
  }
}

export default QuestionController;

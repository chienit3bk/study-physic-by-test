import type { Request, Response } from 'express';
import { crud } from './BaseController';
import { Exam, Question, Tag, sequelize } from '../models';
import { sendError } from '../utils/http';

interface GenerateExamBody {
  totalQuestion: number;
  tags: string[];
  level: number;
  time: number;
}

export class ExamController {
  /** Build an exam by sampling random questions evenly across the given tags. */
  static async generate(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).send({ message: 'Unauthorized' });
        return;
      }

      const { totalQuestion, tags, level, time } = req.body as GenerateExamBody;
      if (!Array.isArray(tags) || tags.length === 0) {
        res.status(400).send({ message: 'tags must be a non-empty array' });
        return;
      }

      const averagePerTag = Math.ceil(totalQuestion / tags.length);
      const minPerTag = Math.floor(totalQuestion / tags.length);

      const newExam = await Exam.create({
        UserId: req.user.id,
        level,
        totalQuestion,
        time,
      });

      const questionsByTag: Record<string, Question[]> = {};
      await Promise.allSettled(
        tags.map(async (tag) => {
          questionsByTag[tag] = await Question.findAll({
            include: Tag,
            where: { mainTag: tag },
            order: [sequelize.fn('RANDOM')],
            limit: averagePerTag,
          });
        }),
      );

      const selected: Question[] = [];
      for (const tag of Object.keys(questionsByTag)) {
        if (selected.length >= totalQuestion) break;
        const pool = questionsByTag[tag];
        for (let i = 0; i < minPerTag && i < pool.length; i += 1) {
          selected.push(pool[i]);
        }
      }
      for (const tag of Object.keys(questionsByTag)) {
        if (selected.length >= totalQuestion) break;
        const pool = questionsByTag[tag];
        if (pool.length > minPerTag) {
          selected.push(pool[minPerTag]);
        }
      }

      const questionIds = selected.map((question) => question.id);
      await newExam.setQuestions(questionIds);

      res.status(200).send(newExam);
    } catch (error) {
      sendError(res, error);
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const result = await Exam.findOne({ where: { id: req.params.id }, include: Question });
      res.status(200).send(result);
    } catch (error) {
      sendError(res, error);
    }
  }

  static async getList(req: Request, res: Response): Promise<void> {
    try {
      const result = await crud.getList(req, 'Exam');
      res.status(200).send(result);
    } catch (error) {
      sendError(res, error);
    }
  }
}

export default ExamController;

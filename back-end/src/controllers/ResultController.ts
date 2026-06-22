import type { Request, Response } from 'express';
import { crud } from './BaseController';
import { Question } from '../models';
import { sendError } from '../utils/http';

interface AnsweredQuestion {
  id: number;
  time?: number;
}

export class ResultController {
  /**
   * Persist an exam result and update the rolling average answer time for each
   * answered question.
   */
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const createdResult = await crud.create(req, 'Result');
      const questions = (req.body.questions ?? []) as AnsweredQuestion[];
      const questionIds = questions.map((question) => question.id);

      const storedQuestions = await Question.findAll({ where: { id: questionIds } });

      await Promise.allSettled(
        storedQuestions.map(async (question) => {
          const answered = questions.find((item) => item.id === question.id);
          const questionTime = answered?.time;
          if (!questionTime) {
            return;
          }
          const newTotalUser = question.totalUser + 1;
          const newAverageTime = Math.round(
            (question.totalUser * question.averateTime + questionTime) / newTotalUser,
          );
          await question.update({ averateTime: newAverageTime, totalUser: newTotalUser });
        }),
      );

      res.status(200).send(createdResult);
    } catch (error) {
      sendError(res, error);
    }
  }

  static async getList(req: Request, res: Response): Promise<void> {
    try {
      const result = await crud.getList(req, 'Result');
      res.status(200).send(result);
    } catch (error) {
      sendError(res, error);
    }
  }
}

export default ResultController;

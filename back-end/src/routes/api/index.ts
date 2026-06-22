import { Router } from 'express';
import userRouter from './userRouter';
import questionRouter from './questionRouter';
import examRouter from './examRouter';
import tagRouter from './tagRouter';
import documentRouter from './documentRouter';
import resultRouter from './resultRouter';

const router = Router();

router.use('/users', userRouter);
router.use('/questions', questionRouter);
router.use('/exams', examRouter);
router.use('/tags', tagRouter);
router.use('/documents', documentRouter);
router.use('/results', resultRouter);

export default router;

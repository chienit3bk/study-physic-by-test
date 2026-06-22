import { Sequelize } from 'sequelize';
import { databaseConfig } from '../config/database';

import { User, initUser } from './user';
import { Tag, initTag } from './tag';
import { Document, initDocument } from './document';
import { Question, initQuestion } from './question';
import { Exam, initExam } from './exam';
import { Result, initResult } from './result';
import { ExamQuestion, initExamQuestion } from './examQuestion';
import { QuestionTag, initQuestionTag } from './questionTag';
import { DocumentTag, initDocumentTag } from './documentTag';

export const sequelize = new Sequelize(databaseConfig);

// Initialise every model against the shared connection.
initUser(sequelize);
initTag(sequelize);
initDocument(sequelize);
initQuestion(sequelize);
initExam(sequelize);
initResult(sequelize);
initExamQuestion(sequelize);
initQuestionTag(sequelize);
initDocumentTag(sequelize);

// Associations
Result.belongsTo(User, { foreignKey: 'UserId' });
Result.belongsTo(Exam, { foreignKey: 'ExamId' });
User.hasMany(Result, { foreignKey: 'UserId' });
Exam.hasMany(Result, { foreignKey: 'ExamId' });

Exam.belongsToMany(Question, { through: ExamQuestion });
Question.belongsToMany(Exam, { through: ExamQuestion });

Tag.belongsToMany(Question, { through: QuestionTag });
Question.belongsToMany(Tag, { through: QuestionTag });

Tag.belongsToMany(Document, { through: DocumentTag });
Document.belongsToMany(Tag, { through: DocumentTag });

export const db = {
  User,
  Tag,
  Document,
  Question,
  Exam,
  Result,
  ExamQuestion,
  QuestionTag,
  DocumentTag,
  sequelize,
  Sequelize,
} as const;

export type Db = typeof db;
export type ModelName =
  | 'User'
  | 'Tag'
  | 'Document'
  | 'Question'
  | 'Exam'
  | 'Result'
  | 'ExamQuestion'
  | 'QuestionTag'
  | 'DocumentTag';

export { User, Tag, Document, Question, Exam, Result, ExamQuestion, QuestionTag, DocumentTag };

export default db;

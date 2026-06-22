import {
  Model,
  DataTypes,
  type InferAttributes,
  type InferCreationAttributes,
  type CreationOptional,
  type Sequelize,
} from 'sequelize';

export class ExamQuestion extends Model<InferAttributes<ExamQuestion>, InferCreationAttributes<ExamQuestion>> {
  declare id: CreationOptional<number>;
  declare QuestionId: number;
  declare ExamId: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export function initExamQuestion(sequelize: Sequelize): typeof ExamQuestion {
  ExamQuestion.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      QuestionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'questions', key: 'id' },
      },
      ExamId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'exams', key: 'id' },
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    { sequelize, modelName: 'ExamQuestion', tableName: 'exam_question' },
  );
  return ExamQuestion;
}

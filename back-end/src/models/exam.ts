import {
  Model,
  DataTypes,
  type InferAttributes,
  type InferCreationAttributes,
  type CreationOptional,
  type Sequelize,
  type BelongsToManySetAssociationsMixin,
} from 'sequelize';
import type { Question } from './question';

export class Exam extends Model<InferAttributes<Exam>, InferCreationAttributes<Exam>> {
  declare id: CreationOptional<number>;
  declare UserId: number;
  declare level: CreationOptional<number>;
  declare totalQuestion: number;
  declare time: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare setQuestions: BelongsToManySetAssociationsMixin<Question, number>;
}

export function initExam(sequelize: Sequelize): typeof Exam {
  Exam.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      UserId: { type: DataTypes.INTEGER, allowNull: false },
      level: { type: DataTypes.INTEGER, defaultValue: 1 },
      totalQuestion: { type: DataTypes.INTEGER, allowNull: false },
      time: { type: DataTypes.INTEGER, allowNull: false },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    { sequelize, modelName: 'Exam', tableName: 'exams' },
  );
  return Exam;
}

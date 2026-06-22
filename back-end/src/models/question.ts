import {
  Model,
  DataTypes,
  type InferAttributes,
  type InferCreationAttributes,
  type CreationOptional,
  type Sequelize,
  type BelongsToManySetAssociationsMixin,
} from 'sequelize';
import type { Tag } from './tag';

/** A single answer option stored inside the questions.answer JSONB column. */
export interface AnswerOption {
  content: string;
  isCorrect?: boolean;
  [key: string]: unknown;
}

export class Question extends Model<InferAttributes<Question>, InferCreationAttributes<Question>> {
  declare id: CreationOptional<number>;
  declare description: string;
  declare trueAnswer: string;
  declare averateTime: CreationOptional<number>;
  declare mainTag: CreationOptional<string | null>;
  declare instruction: CreationOptional<string | null>;
  declare image: CreationOptional<string | null>;
  declare verify: CreationOptional<boolean>;
  declare level: CreationOptional<number>;
  declare answer: CreationOptional<AnswerOption[] | null>;
  declare totalUser: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare setTags: BelongsToManySetAssociationsMixin<Tag, number>;
}

export function initQuestion(sequelize: Sequelize): typeof Question {
  Question.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      description: { type: DataTypes.STRING, allowNull: false },
      trueAnswer: { type: DataTypes.STRING, allowNull: false },
      averateTime: { type: DataTypes.INTEGER, defaultValue: -1 },
      mainTag: { type: DataTypes.STRING, allowNull: true },
      instruction: { type: DataTypes.STRING, allowNull: true },
      image: { type: DataTypes.STRING, allowNull: true },
      verify: { type: DataTypes.BOOLEAN, defaultValue: false },
      level: { type: DataTypes.INTEGER, defaultValue: 1 },
      answer: { type: DataTypes.JSONB, allowNull: true },
      totalUser: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    { sequelize, modelName: 'Question', tableName: 'questions' },
  );
  return Question;
}

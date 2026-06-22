import {
  Model,
  DataTypes,
  type InferAttributes,
  type InferCreationAttributes,
  type CreationOptional,
  type Sequelize,
} from 'sequelize';

export class QuestionTag extends Model<InferAttributes<QuestionTag>, InferCreationAttributes<QuestionTag>> {
  declare id: CreationOptional<number>;
  declare QuestionId: number;
  declare TagId: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export function initQuestionTag(sequelize: Sequelize): typeof QuestionTag {
  QuestionTag.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      QuestionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'questions', key: 'id' },
      },
      TagId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'tags', key: 'id' },
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    { sequelize, modelName: 'QuestionTag', tableName: 'question_tag' },
  );
  return QuestionTag;
}

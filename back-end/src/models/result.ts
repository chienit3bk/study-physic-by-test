import {
  Model,
  DataTypes,
  type InferAttributes,
  type InferCreationAttributes,
  type CreationOptional,
  type Sequelize,
} from 'sequelize';

export class Result extends Model<InferAttributes<Result>, InferCreationAttributes<Result>> {
  declare id: CreationOptional<number>;
  declare UserId: number;
  declare ExamId: number;
  declare totalTime: number;
  declare totalQuestion: number;
  declare totalTrueQuestion: number;
  declare score: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export function initResult(sequelize: Sequelize): typeof Result {
  Result.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      UserId: { type: DataTypes.INTEGER, allowNull: false },
      ExamId: { type: DataTypes.INTEGER, allowNull: false },
      totalTime: { type: DataTypes.INTEGER, allowNull: false },
      totalQuestion: { type: DataTypes.INTEGER, allowNull: false },
      totalTrueQuestion: { type: DataTypes.INTEGER, allowNull: false },
      score: { type: DataTypes.FLOAT, allowNull: false },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    { sequelize, modelName: 'Result', tableName: 'results' },
  );
  return Result;
}

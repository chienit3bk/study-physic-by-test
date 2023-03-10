'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Result extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      const {
        User,
        Exam,
      } = models;
      this.belongsTo(User);
      this.belongsTo(Exam);
    }
  }
  Result.init({
    UserId: DataTypes.INTEGER,
    ExamId: DataTypes.INTEGER,
    totalTime: DataTypes.INTEGER,
    totalQuestion: DataTypes.INTEGER,
    totalTrueQuestion: DataTypes.INTEGER,
    score: DataTypes.FLOAT,
  }, {
    sequelize,
    modelName: 'Result',
    tableName: 'results',
  });
  return Result;
};

'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Question extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Question.init({
    description: DataTypes.STRING,
    trueAnswer: DataTypes.STRING,
    averateTime: DataTypes.INTEGER,
    mainTag: DataTypes.STRING,
    instruction: DataTypes.STRING,
    image: DataTypes.STRING,
    verify: DataTypes.BOOLEAN,
    level: DataTypes.INTEGER,
    answer: DataTypes.JSONB,
    totalUser: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Question',
    tableName: 'questions',
  });
  return Question;
};

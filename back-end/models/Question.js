const { Sequelize, DataTypes } = require("sequelize");

const Question = Sequelize.define("questions", {
  description: {
    type: DataTypes.STRING,
  },
  trueAnswer: {
    type: DataTypes.STRING,
  },
  averateTime: {
    type: DataTypes.INTEGER,
  },
  mainTag: {
    type: DataTypes.STRING,
  },
  instruction: {
    type: DataTypes.STRING,
  },
  image: {
    type: DataTypes.STRING,
  },
  verify: {
    type: DataTypes.BOOLEAN,
  },
  // 1 to 10 for easy to hard
  level: {
    type: DataTypes.INTEGER,
  },
  answer: {
    type: DataTypes.ARRAY,
  }
});

module.exports = Question;

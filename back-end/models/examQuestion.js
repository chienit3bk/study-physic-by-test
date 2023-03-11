'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ExamQuestion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      const {
        Exam,
        Question,
      } = models;
      Exam.belongsToMany(Question, {
        through: this,
      });
      Question.belongsToMany(Exam, {
        through: this,
      })
    }
  }
  ExamQuestion.init({
    QuestionId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'questions',
        key: 'id',
      },
    },
    ExamId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'exams',
        key: 'id',
      },
    },
  }, {
    sequelize,
    modelName: 'ExamQuestion',
    tableName: 'exam_question',
  });
  return ExamQuestion;
};

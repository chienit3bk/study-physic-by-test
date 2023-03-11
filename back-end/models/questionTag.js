'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class QuestionTag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      const {
        Tag,
        Question,
      } = models;
      Tag.belongsToMany(Question, {
        through: this,
      });
      Question.belongsToMany(Tag, {
        through: this,
      });
    }
  }
  QuestionTag.init({
    QuestionId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'questions',
        key: 'id',
      },
    },
    TagId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'tags',
        key: 'id',
      },
    },
  }, {
    sequelize,
    modelName: 'QuestionTag',
    tableName: 'question_tag',
  });

  return QuestionTag;
};

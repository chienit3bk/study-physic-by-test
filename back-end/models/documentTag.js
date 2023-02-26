'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DocumentTag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      const {
        Tag,
        Document,
      } = models;
      Tag.belongsToMany(Document, {
        through: this,
      });
      Document.belongsToMany(Tag, {
        through: this,
      });
    }
  }
  DocumentTag.init({
    DocumentId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'documents',
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
    modelName: 'DocumentTag',
    tableName: 'document_tag',
  });

  return DocumentTag;
};

import {
  Model,
  DataTypes,
  type InferAttributes,
  type InferCreationAttributes,
  type CreationOptional,
  type Sequelize,
} from 'sequelize';

export class DocumentTag extends Model<InferAttributes<DocumentTag>, InferCreationAttributes<DocumentTag>> {
  declare id: CreationOptional<number>;
  declare DocumentId: number;
  declare TagId: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export function initDocumentTag(sequelize: Sequelize): typeof DocumentTag {
  DocumentTag.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      DocumentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'documents', key: 'id' },
      },
      TagId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'tags', key: 'id' },
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    { sequelize, modelName: 'DocumentTag', tableName: 'document_tag' },
  );
  return DocumentTag;
}

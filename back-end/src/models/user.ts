import {
  Model,
  DataTypes,
  type InferAttributes,
  type InferCreationAttributes,
  type CreationOptional,
  type Sequelize,
} from 'sequelize';

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare email: string;
  declare password: string;
  declare phone: CreationOptional<string | null>;
  declare address: CreationOptional<string | null>;
  declare role: string;
  declare level: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export function initUser(sequelize: Sequelize): typeof User {
  User.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false },
      password: { type: DataTypes.STRING, allowNull: false },
      phone: { type: DataTypes.STRING, allowNull: true },
      address: { type: DataTypes.STRING, allowNull: true },
      role: { type: DataTypes.STRING, allowNull: false },
      level: { type: DataTypes.FLOAT, defaultValue: 0 },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    { sequelize, modelName: 'User', tableName: 'users' },
  );
  return User;
}

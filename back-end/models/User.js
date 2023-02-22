const { Sequelize, DataTypes } = require("sequelize");

const User = Sequelize.define("users", {
  name: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
  },
  password: {
    type: DataTypes.INTEGER,
  },
  phone: {
    type: DataTypes.STRING,
  },
  address: {
    type: DataTypes.STRING,
  },
  role: {
    type: DataTypes.STRING,
  },
  level: {
    type: DataTypes.FLOAT,
  },
});

module.exports = User;

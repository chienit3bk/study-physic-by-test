const { Sequelize, DataTypes } = require("sequelize");

const Tag = Sequelize.define("tags", {
  content: {
    type: DataTypes.STRING,
  },
  document: {
    type: DataTypes.STRING,
  },
});

module.exports = Tag;

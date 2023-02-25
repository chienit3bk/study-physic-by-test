'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('questions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      trueAnswer: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      averateTime: {
        type: Sequelize.INTEGER,
        defaultValue: -1,
      },
      mainTag: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      instruction: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      image: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      verify: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      // 1 to 10 for easy to hard
      level: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
      answer: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('questions');
  }
};

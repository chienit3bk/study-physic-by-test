'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('results', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      UserId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      ExamId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      totalTime: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      totalQuestion: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      totalTrueQuestion: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      score: {
        allowNull: false,
        type: Sequelize.FLOAT,
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

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('results');
  }
};

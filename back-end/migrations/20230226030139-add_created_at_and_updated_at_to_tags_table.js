'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('tags', 'createdAt', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: new Date(),
    });
    await queryInterface.addColumn('tags', 'updatedAt', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: new Date(),
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('tags', 'createdAt');
    await queryInterface.removeColumn('tags', 'updatedAt');
  }
};

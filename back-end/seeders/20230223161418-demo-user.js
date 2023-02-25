'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const fakeUsersData = [];
    for (let i = 0; i < 5; i++) {
      fakeUsersData.push({
        name: `Test ${i}`,
        email: `test${i}@test.com`,
        password: '123456',
        phone: '93791623784',
        address: 'No where',
        role: 'test',
        level: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    await queryInterface.bulkInsert('users', fakeUsersData, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', {
      where: {
        role: 'test',
      },
    }, {});
  }
};

'use strict';

const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const [existing] = await queryInterface.sequelize.query(
      "SELECT id FROM users WHERE email = 'admin@test.com' LIMIT 1",
    );
    if (existing.length > 0) {
      console.log('demo users already seeded, skipping');
      return;
    }

    const now = new Date();
    const password = bcrypt.hashSync('123456', 10);

    const users = [
      { name: 'Admin', email: 'admin@test.com', password, phone: '0900000000', address: 'HQ', role: 'admin', level: 10, createdAt: now, updatedAt: now },
      { name: 'Student', email: 'student@test.com', password, phone: '0900000001', address: 'Somewhere', role: 'user', level: 1, createdAt: now, updatedAt: now },
    ];

    for (let i = 0; i < 3; i += 1) {
      users.push({
        name: `Test ${i}`,
        email: `test${i}@test.com`,
        password,
        phone: '0900000000',
        address: 'No where',
        role: 'user',
        level: 0,
        createdAt: now,
        updatedAt: now,
      });
    }

    await queryInterface.bulkInsert('users', users, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', {
      email: {
        [Sequelize.Op.in]: [
          'admin@test.com',
          'student@test.com',
          'test0@test.com',
          'test1@test.com',
          'test2@test.com',
        ],
      },
    }, {});
  },
};

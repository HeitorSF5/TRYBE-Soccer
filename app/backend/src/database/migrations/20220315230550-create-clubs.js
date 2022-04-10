'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('clubs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      clubName: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'club_name',
      },
    }, {
      underscored: true,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('clubs');
  }
};
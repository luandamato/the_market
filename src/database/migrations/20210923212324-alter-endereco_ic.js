'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('users', 'endereco_id', {
      type: Sequelize.STRING,
      allowNull: true
    })
  
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('users', 'endereco_id', {
      type: Sequelize.INTEGER,
      allowNull: true
    })
  }
};

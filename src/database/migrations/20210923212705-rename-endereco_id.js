'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('users', 'endereco_id', 'socket_id');
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('users', 'socket_id', 'endereco_id');
  }
};

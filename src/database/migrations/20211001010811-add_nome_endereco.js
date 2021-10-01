'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn("enderecos", "nome", {type: Sequelize.STRING})
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('enderecos', 'nome', { });
  }
};

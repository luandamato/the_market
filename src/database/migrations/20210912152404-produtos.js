'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
     return queryInterface.createTable('produtos', {
       id:{
         type: Sequelize.INTEGER,
         primaryKey: true,
         autoIncrement: true,
         allowNull: false
       },
       nome:{
         type: Sequelize.STRING,
         allowNull: false
       },
       descricao: {
        type: Sequelize.STRING,
        allowNull: false
      },
      preco: {
        type: Sequelize.STRING,
        allowNull: false
      },
      ativo: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      usado: {
        type: Sequelize.BOOLEAN,
      },
      qtd_vendidos: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      desativar_ao_vender: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      anunciante_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id"},
        onUpdate: 'CASCADE',
        onDelete: "RESTRICT",
      },
       created_at:{
         type: Sequelize.DATE,
         allowNull: false
       },
       updated_at:{
         type: Sequelize.DATE,
         allowNull: false
       }
     })
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable("produtos")
  }
};

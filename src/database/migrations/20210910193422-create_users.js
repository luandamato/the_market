'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
     return queryInterface.createTable('users', {
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
       nascimento: {
        type: Sequelize.DATE,
        allowNull: false
      },
      cpf: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
      },
      telefone: {
        type: Sequelize.STRING,
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      senha: {
        type: Sequelize.STRING,
        allowNull: false
      },
      foto: {
        type: Sequelize.STRING,
      },
      bio: {
        type: Sequelize.STRING,
      },
      endereco_id: {
        type: Sequelize.INTEGER,
      },
      codigo: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      email_validado: {
        type: Sequelize.BOOLEAN,
        allowNull: false
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
    
  }
};

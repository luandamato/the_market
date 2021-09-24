'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('enderecos', {
      id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      user_id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id"},
        onUpdate: 'CASCADE',
        onDelete: "RESTRICT",
      },
     rua: {
       type: Sequelize.STRING,
       allowNull: true
     },
     bairro: {
       type: Sequelize.STRING,
       allowNull: true,
     },
     cidade: {
       type: Sequelize.STRING,
       allowNull: true
     },
     estado: {
       type: Sequelize.STRING,
       allowNull: true,
     },
     pais: {
       type: Sequelize.STRING,
       allowNull: true
     },
     numero: {
       type: Sequelize.STRING,
       allowNull: true,
     },
     complemento: {
       type: Sequelize.STRING,
       allowNull: true
     },
     zip: {
       type: Sequelize.STRING,
       allowNull: true,
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
   return queryInterface.dropTable("enderecos")
 }
};

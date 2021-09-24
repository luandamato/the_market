'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('mensagens', {
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
      user2_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id"},
        onUpdate: 'CASCADE',
        onDelete: "RESTRICT",
     },
     mensagem: {
       type: Sequelize.STRING(1234),
       allowNull: true
     },
     imagem: {
       type: Sequelize.BLOB('long'),
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
   return queryInterface.dropTable("mensagens")
 }
};

const { Model, DataTypes } = require('sequelize');

class Mensagem extends Model{
    static init(sequelize) {
        super.init({
            mensagem: DataTypes.STRING,
            imagem: DataTypes.STRING,
        }, {
            sequelize,
            tableName: 'Mensagens'
        })
    }

    static associate(models){
        this.belongsTo(models.User, {foreignKey: "user_id", as: "user"})
        this.belongsTo(models.User, {foreignKey: "user2_id", as: "user2"})
    }
}

module.exports = Mensagem;
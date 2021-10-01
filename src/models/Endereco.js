const { Model, DataTypes } = require('sequelize');

class Endereco extends Model{
    static init(sequelize) {
        super.init({
            rua: DataTypes.STRING,
            bairro: DataTypes.STRING,
            cidade: DataTypes.STRING,
            estado: DataTypes.STRING,
            pais: DataTypes.STRING,
            numero: DataTypes.STRING,
            complemento: DataTypes.STRING,
            zip: DataTypes.STRING,
            nome: DataTypes.STRING,
        }, {
            sequelize,
            tableName: 'enderecos'
        })
    }

    static associate(models){
        this.belongsTo(models.User, {foreignKey: "user_id", as: "user"})
    }
}

module.exports = Endereco;
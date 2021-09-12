const { Model, DataTypes } = require('sequelize');

class Produto extends Model{
    static init(sequelize) {
        super.init({
            nome: DataTypes.STRING,
            descricao: DataTypes.STRING,
            preco: DataTypes.STRING,
            usado: DataTypes.STRING,
            ativo: DataTypes.STRING,
            qtd_vendidos: DataTypes.INTEGER,
            desativar_ao_vender: DataTypes.STRING,

        }, {
            sequelize
        })
    }

    static associate(models){
        this.belongsTo(models.User, {foreignKey: "anunciante_id", as: "user"})
    }
}

module.exports = Produto;
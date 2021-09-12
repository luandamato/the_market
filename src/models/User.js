const { Model, DataTypes } = require('sequelize');

class User extends Model{
    static init(sequelize) {
        super.init({
            nome: DataTypes.STRING,
            nascimento: DataTypes.DATE,
            cpf: DataTypes.STRING,
            email: DataTypes.STRING,
            telefone: DataTypes.STRING,
            username: DataTypes.STRING,
            senha: DataTypes.STRING,
            foto: DataTypes.STRING,
            bio: DataTypes.STRING,
            enderecoId: DataTypes.INTEGER,
            codigo: DataTypes.STRING,
            email_validado: DataTypes.STRING

        }, {
            sequelize
        })
    }

    static associate(models){
        this.hasMany(models.Produto, { foreignKey:"anunciante_id", as: "produtos"})
    }
}

module.exports = User;
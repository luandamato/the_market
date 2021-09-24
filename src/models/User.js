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
            socket_id: DataTypes.STRING,
            codigo: DataTypes.STRING,
            email_validado: DataTypes.STRING

        }, {
            sequelize
        })
    }

    static associate(models){
        this.hasMany(models.Produto, { foreignKey:"anunciante_id", as: "produtos"})
        this.hasMany(models.Mensagem, { foreignKey:"user_id", as: "mensagens"})
        this.hasMany(models.Endereco, { foreignKey:"user_id", as: "enderecos"})
    }
}

module.exports = User;
const Endereco = require('../src/models/Endereco');
const User = require('../src/models/User');
const Op = require('sequelize').Op
const helper = require('../src/helper.js');

module.exports = {
    async cadastrar(req, res){
        try{
            const required = {
                rua: req.body.rua,
                bairro: req.body.bairro,
                cidade: req.body.cidade,
                estado: req.body.estado,
                pais: req.body.pais,
                numero: req.body.numero,
                complemento: req.body.complemento,
                zip: req.body.zip,
                user_id: req.body.user_id
            };

            const non_required = {};
            let requestdata = await helper.vaildObject(required, non_required, res);

            var { rua, bairro, cidade, estado, pais, numero, complemento, zip, user_id } = req.body;

            const user = await User.findByPk(user_id);

            if (!user) {
                return helper.false_status(res, "Usuário não encontrado");
            }
            
            const end = await Endereco.create({ rua, bairro, cidade, estado, pais, numero, complemento, zip, user_id });
    
            let msg = "sucesso";
            let body = {end};
            return helper.true_status(res, body, msg);
        } catch (error) {
            throw error
        }
        
    },

    async novoEndereco(rua, bairro, cidade, estado, pais, numero, complemento, zip, user_id){
        try{
            const user = await User.findByPk(user_id);

            if (!user) {
                return;
            }
            const end = await Endereco.create({ rua, bairro, cidade, estado, pais, numero, complemento, zip, user_id });
    
            return end;
        } catch (error) {
            throw error
        }
        
    },

};
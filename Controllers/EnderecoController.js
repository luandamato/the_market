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
                zip: req.body.zip,
                user_id: req.body.user_id
            };

            const non_required = {};
            let requestdata = await helper.vaildObject(required, non_required, res);

            var { rua, bairro, cidade, estado, pais, numero, complemento, zip, user_id, nome } = req.body;

            const user = await User.findByPk(user_id);

            if (!user) {
                return helper.false_status(res, "Usuário não encontrado");
            }
            
            const end = await Endereco.create({ rua, bairro, cidade, estado, pais, numero, complemento, zip, user_id, nome });
    
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

            if (!user || !rua || !bairro || !cidade || !estado) {
                return;
            }
            const end = await Endereco.create({ rua, bairro, cidade, estado, pais, numero, complemento, zip, user_id });
    
            return end;
        } catch (error) {
            throw error
        }
        
    },

    async getEnderecos(req, res){
        try{
            const required = {
                id: req.params.user_id
            };
            const non_required = {}

            let requestdata = await helper.vaildObject(required, non_required, res);

            var { user_id } = req.params;

            const enderecos = await Endereco.findAll({
                where: {user_id: user_id}
            })
            let msg = "sucesso";
            let body = {enderecos};
            return helper.true_status(res, body, msg);
        } catch (error) {
            throw error
        }
        
    },

    async update(req, res){
        try{
            const required = {
                rua: req.body.rua,
                bairro: req.body.bairro,
                cidade: req.body.cidade,
                estado: req.body.estado,
                numero: req.body.numero,
                zip: req.body.zip,
                id: req.body.id
            };

            const non_required = {};
            let requestdata = await helper.vaildObject(required, non_required, res);

            var { rua, bairro, cidade, estado, pais, numero, complemento, zip, id, nome } = req.body;

            const update = Endereco.update({
                rua, bairro, cidade, estado, pais, numero, complemento, zip, nome
            },
            {
                where:{
                    id: id
                }
            })


            let msg = "sucesso";
            let body = {update};
            return helper.true_status(res, body, msg);
        } catch (error) {
            throw error
        }
        
    },


    async excluir(req, res){
        try{
            const required = {
                id: req.body.id,
            };

            const non_required = {};
            let requestdata = await helper.vaildObject(required, non_required, res);

            var { id } = req.body;

            const update = Endereco.destroy(
            {
                where:{
                    id: id
                }
            })


            let msg = "sucesso";
            let body = {update};
            return helper.true_status(res, body, msg);
        } catch (error) {
            throw error
        }
        
    },

};
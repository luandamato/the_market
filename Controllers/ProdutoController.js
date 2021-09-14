const Produto = require('../src/models/Produto');
const User = require('../src/models/User');
const Op = require('sequelize').Op
const helper = require('../src/helper.js');

module.exports = {
    async cadastrar(req, res){
        try{
            const required = {
                nome: req.body.nome,
                descricao: req.body.descricao,
                preco: req.body.preco,
                usado: req.body.usado,
                desativar_ao_vender: req.body.desativar_ao_vender,
                anunciante_id: req.body.anunciante_id
            };
            const non_required = {};
            let requestdata = await helper.vaildObject(required, non_required, res);

            var { nome, descricao, preco, usado, desativar_ao_vender, anunciante_id } = req.body;
            console.log(nome, descricao, preco, usado, desativar_ao_vender, anunciante_id)

            const user = await User.findByPk(anunciante_id);

            if (!user) {
                return helper.false_status(res, "Usuário não encontrado");
            }
            
            usado = helper.getBoolValue(usado);
            desativar_ao_vender = helper.getBoolValue(desativar_ao_vender);
            ativo = true
            const produto = await Produto.create({ nome, descricao, preco, usado, desativar_ao_vender, anunciante_id, ativo });
    
            let msg = "sucesso";
            let body = {produto};
            return helper.true_status(res, body, msg);
        } catch (error) {
            throw error
        }
        
    },

    async produtosDoUsuario(req, res){
        var { user_id } = req.params;
        const user = await User.findByPk(user_id, 
            {include: {association: "produtos"}
        });

        let msg = "sucesso";
        let body = {user};
        return helper.true_status(res, body, msg);
    },
    async produtos(req, res){
        try{
            const produtos = await Produto.findAll({
                //include: [{association: "user"}],
                order: [["created_at", "DESC"]]
            })
    
            if (produtos){
                let msg = "sucesso";
                let body = {produtos};
                return helper.true_status(res, body, msg);
            }
            else{
                return helper.false_status(res, "Nenhum produto encontrado :(");
            }
        } catch (error) {
            throw error
        }
        
    },
    async produto(req, res){
        try{
            const required = {
                id: req.params.id
            };
            const non_required = {};
            let requestdata = await helper.vaildObject(required, non_required, res);
            const { id } = req.params;
            const produto = await Produto.findByPk(id, 
                {include: {association: "user"}
            });
    
            if (produto){
                let msg = "sucesso";
                let body = {produto};
                return helper.true_status(res, body, msg);
            }
            else{
                return helper.false_status(res, "Nenhum produto encontrado :(");
            }
        } catch (error) {
            throw error
        }
        
    },
    async enviarEmailValidacao(req, res){
        try{
            const required = {
                id: req.body.id
            };
            const non_required = {};
            let requestdata = await helper.vaildObject(required, non_required, res);

            const { id } = req.body;
            const user = await User.findOne({
                where:{
                    id
                }
            })
    
            if (user){
                helper.mandarEmail(user.email, res);
                let msg = "Verifique seu email";
                return helper.true_status(res, {}, msg);
            }
            else{
                return helper.false_status(res, "Usuário não encontrado");
            }
        } catch (error) {
            throw error
        }
        
    },
    async validarEmail(req, res){
        try{
            const required = {
                id: req.body.id,
                codigo: req.body.codigo
            };
            const non_required = {};
            let requestdata = await helper.vaildObject(required, non_required, res);

            const { id, codigo } = req.body;
            const user = await User.findOne({
                where:{
                   id
                }
            })
    
            if (user){
                if (codigo == user.codigo){
                    var update = await User.update({
                        email_validado: true,
                    }, {
                        where: {
                            id: user.id
                        }
                    })
                    if (update){
                        const msg = "email validado com sucesso!";
                        return helper.true_status(res, {}, msg);
                    }
                    else{
                        return helper.false_status(res, "Ocorreu um erro"); 
                    }
                }
                else{
                    return helper.false_status(res, "O código informado não está correto"); 
                }
                
            }
            else{
                return helper.false_status(res, "Usuário não encontrado");
            }
        } catch (error) {
            throw error
        }
        
    },
};
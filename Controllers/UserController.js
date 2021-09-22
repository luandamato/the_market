const User = require('../src/models/User');
const Produto = require('../src/models/Produto');
const Op = require('sequelize').Op
const helper = require('../src/helper.js');

module.exports = {
    async cadastrar(req, res){
        try{
            const required = {
                nome: req.body.nome,
                nascimento: req.body.nascimento,
                cpf: req.body.cpf,
                email: req.body.email,
                telefone: req.body.telefone,
                username: req.body.username,
                senha: req.body.senha
            };
            const non_required = {
                foto: req.body.foto,
                bio: req.body.bio,
                enderecoId: req.body.enderecoId,
            };
            let requestdata = await helper.vaildObject(required, non_required, res);

            var { nome, nascimento, cpf, email, telefone, username, senha, foto, bio, enderecoId } = req.body;
            senha = await helper.criptografar(senha);
            const codigo = Math.floor(Math.random() * 10000);
            const email_validado = false;
    
            const existUsername = await User.findOne({
                where: {
                    [Op.or]: [
                        {
                            username: {
                                [Op.eq]: username
                            }
                        },
                        {
                            email: {
                                [Op.eq]: email
                            }
                        }
                    ]
                }
                
            })
    
            if (existUsername){
                return helper.already_exist(res, "O username ou email escolhido ja está cadastrado")
            }
            const user = await User.create({ nome, nascimento, cpf, email, telefone, username, senha, foto, bio, enderecoId, codigo, email_validado});
    
            let msg = "sucesso";
            let body = {user: user};
            return helper.true_status(res, user, msg);
        } catch (error) {
            throw error
        }
        
    },
    async getUser(req, res){
        try{
            const required = {
                id: req.params.id
            };
            const non_required = {};
            let requestdata = await helper.vaildObject(required, non_required, res);

            const { id } = req.params;
            const user = await User.findOne({
                where:{
                    id,
                }
            })

            const produtos = await Produto.count({ 
                where: {
                    anunciante_id: id
                }
            })
            
    
            if (user){
                user.dataValues.qtdProdutos = produtos;
                let msg = "sucesso";
                let body = {user: user};
                return helper.true_status(res, body, msg);
            }
            else{
                return helper.false_status(res, "Usuário não encontrado");
            }
        } catch (error) {
            throw error
        }
        
    },
    async login(req, res){
        try{
            const required = {
                username: req.body.username,
                senha: req.body.senha
            };
            const non_required = {};
            let requestdata = await helper.vaildObject(required, non_required, res);

            const { username, senha } = req.body;
            let crip = await helper.criptografar(senha);
            const user = await User.findOne({
                where:{
                    senha: crip,
                    [Op.or]: [
                        {
                            username: {
                                [Op.eq]: username
                            }
                        },
                        {
                            email: {
                                [Op.eq]: username
                            }
                        }
                    ]
                }
            })
    
            if (user){
                let msg = "sucesso";
                let body = {user: user};
                return helper.true_status(res, body, msg);
            }
            else{
                return helper.false_status(res, "Usuário não encontrado");
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
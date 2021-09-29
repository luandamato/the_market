const User = require('../src/models/User');
const Produto = require('../src/models/Produto');
const Op = require('sequelize').Op
const helper = require('../src/helper.js');
const endController = require('./EnderecoController')

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
                rua: req.body.rua,
                bairro: req.body.bairro,
                cidade: req.body.cidade,
                estado: req.body.estado,
                pais: req.body.pais,
                numero: req.body.numero,
                complemento: req.body.complemento,
                zip: req.body.zip
            };
            let requestdata = await helper.vaildObject(required, non_required, res);

            var { nome, nascimento, cpf, email, telefone, username, senha, foto, bio } = req.body;
            senha = await helper.criptografar(senha);
            const codigo = Math.floor(Math.random() * 10000);
            const email_validado = false;
    
            const existUsername = await User.findOne({
                where: {
                    [Op.or]: [
                        {
                            [Op.or]: [
                                { username: { [Op.eq]: username}},
                                {email: {[Op.eq]: username}}
                            ]
                        },
                        {
                            [Op.or]: [
                                { username: { [Op.eq]: email}},
                                {email: {[Op.eq]: email}}
                            ]
                        }
                    ]
                }
                
            })
    
            if (existUsername){
                return helper.already_exist(res, "O username ou email escolhido ja está cadastrado")
            }
            const user = await User.create({ nome, nascimento, cpf, email, telefone, username, senha, foto, bio, codigo, email_validado});
            
            if (!user){
                let msg = "Erro ao criar usuario";
                return helper.false_status(res, msg);
            }

            //criar endereco para usuario
            var { rua, bairro, cidade, estado, pais, numero, complemento, zip } = req.body;
            var end = await endController.novoEndereco(rua, bairro, cidade, estado, "br", numero, complemento, zip, user.id);
            


            let msg = "sucesso";
            return helper.true_status(res, user, msg);
        } catch (error) {
            throw error
        }
        
    },

    async update(req, res){
        try{
            const required = {
                nome: req.body.nome,
                nascimento: req.body.nascimento,
                cpf: req.body.cpf,
                email: req.body.email,
                telefone: req.body.telefone,
                username: req.body.username
            };
            const non_required = {
            };
            let requestdata = await helper.vaildObject(required, non_required, res);

            var { nome, nascimento, cpf, email, telefone, username, bio, id } = req.body;

            const existUsername = await User.findOne(
            {
                where: {
                    [Op.and]: [
                        { 
                            [Op.or]: [
                                {
                                    [Op.or]: [
                                        { username: { [Op.eq]: username}},
                                        {email: {[Op.eq]: username}}
                                    ]
                                },
                                {
                                    [Op.or]: [
                                        { username: { [Op.eq]: email}},
                                        {email: {[Op.eq]: email}}
                                    ]
                                }
                            ]
                        },
                        {
                            id: {[Op.not]: id}
                        }
                    ]
                    
                }
            })
    
            if (existUsername){
                return helper.already_exist(res, "O username ou email escolhido ja está cadastrado")
            }
    
            
            const user = await User.update({ 
                nome, nascimento, cpf, email, telefone, username, bio
            },
            {
                where: {
                    id: id
                }
            });
            

            let msg = "sucesso";
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
                }, 
                include: {association: "enderecos"}
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
    async getUsers(req, res){
        try{
            const required = {
                nome: req.params.nome
            };
            const non_required = {};
            let requestdata = await helper.vaildObject(required, non_required, res);

            var { nome } = req.params;
            nome = "%"+nome+"%";
            const user = await User.findAll({
                where: {
                    [Op.or]: [
                        {
                            username: {
                                [Op.like]: nome
                            }
                        },
                        {
                            nome: {
                                [Op.like]: nome
                            }
                        }
                    ]
                }
            })

            
    
            if (user){
                let msg = "sucesso";
                let body = {user};
                return helper.true_status(res, body, msg);
            }
            else{
                return helper.false_status(res, "Usuário não encontrado");
            }
        } catch (error) {
            throw error
        }
        
    },
};
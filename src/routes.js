const express = require('express');
const views = require('../views/rotas');
const userController = require('../Controllers/UserController');
const produtoController = require('../Controllers/ProdutoController');
const enderecoController = require('../Controllers/EnderecoController');
const mensagestController = require('../Controllers/MensagensController');

const passport = require('passport')

function authMiddleware(req, res, next) {
    console.log("auth middleware " + req.isAuthenticated())
    if (req.isAuthenticated()){
        return next();
    }
    else{
        if(req.method == "POST"){
            return res.status(405).json({direcionar: "login"})
        }
        else{
            res.status(405).json({direcionar: "home"})
        }
    }
}

function admMiddleware(req, res, next) {
    console.log("adm: " + req.params.adm + " auth middleware " + req.isAuthenticated())
    if (req.isAuthenticated() && req.params.adm === 'true'){
        return next();
    }
    else{
        res.status(405).json({
			'success':0,
			'code':405,
			'msg':"Só administradores tem acesso a essa função",
            'direcionar': "home",
			'data':[],
		});
        
    }
    
}

const routes  = express.Router();

routes.get('/json', views.json);
routes.get('/login', views.login);
routes.post('/login', passport.authenticate('local', {failureRedirect: '/login?erro=true'}), 
    function(req, res) {
        userController.login(req, res)
    })

routes.get('/', views.home);
routes.get('/home', views.home);
routes.get("/produtos", produtoController.produtos)
routes.get("/produto/:id", produtoController.produto)
routes.post('/user', userController.cadastrar)

routes.get("/user/produtos/:user_id", authMiddleware, produtoController.produtosDoUsuario)
routes.get('/user/:id', authMiddleware, userController.getUser)
routes.get('/usersByName/:nome', authMiddleware, userController.getUsers)

routes.post('/enviarEmailValidacao', authMiddleware, userController.enviarEmailValidacao)
routes.post('/validarEmail', authMiddleware, userController.validarEmail)
routes.post('/atualizarUser', authMiddleware, userController.update)
routes.post('/trocarSenha', authMiddleware, userController.trocarSenha)

routes.post("/produto", authMiddleware, produtoController.cadastrar)

routes.get("/conversas/historico/:id", authMiddleware, mensagestController.getConversas)
routes.get("/conversa/:id/:id2", authMiddleware, mensagestController.getConversa)

routes.get('/enderecos/:user_id', authMiddleware, enderecoController.getEnderecos)
routes.post('/novoEndereco', authMiddleware, enderecoController.cadastrar)
routes.post('/atualizarEndereco', authMiddleware, enderecoController.update)
routes.post('/excluirEndereco', authMiddleware, enderecoController.excluir)


routes.get('/chat', authMiddleware, views.chat);
routes.get('/listUsers/:adm', admMiddleware, userController.getAllUser);

module.exports = routes;
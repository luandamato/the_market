const express = require('express');
const views = require('../views/rotas');
const userController = require('../Controllers/UserController');
const produtoController = require('../Controllers/ProdutoController');

const routes  = express.Router();

routes.get('/', views.home);
routes.get('/json', views.json);
routes.post('/user', userController.cadastrar)
routes.post('/getUser', userController.getUser)
routes.post('/login', userController.login)
routes.post('/enviarEmailValidacao', userController.enviarEmailValidacao)
routes.post('/validarEmail', userController.validarEmail)

routes.post("/produto", produtoController.cadastrar)
routes.get("/user/produtos/:user_id", produtoController.produtosDoUsuario)


module.exports = routes;
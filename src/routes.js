const express = require('express');
const views = require('../views/rotas');
const userController = require('../Controllers/UserController');
const produtoController = require('../Controllers/ProdutoController');

const routes  = express.Router();

routes.get('/', views.home);
routes.get('/json', views.json);
routes.post('/user', userController.cadastrar)
routes.get('/user/:id', userController.getUser)
routes.post('/login', userController.login)
routes.post('/enviarEmailValidacao', userController.enviarEmailValidacao)
routes.post('/validarEmail', userController.validarEmail)

routes.post("/produto", produtoController.cadastrar)
routes.get("/produtos", produtoController.produtos)
routes.get("/produto/:id", produtoController.produto)
routes.get("/user/produtos/:user_id", produtoController.produtosDoUsuario)


module.exports = routes;
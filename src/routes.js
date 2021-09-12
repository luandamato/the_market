const express = require('express');
const views = require('../views/rotas');
const userController = require('../Controllers/UserController')

const routes  = express.Router();

routes.get('/', views.home);
routes.post('/user', userController.cadastrar)
routes.post('/getUser', userController.getUser)
routes.post('/login', userController.login)
routes.post('/enviarEmailValidacao', userController.enviarEmailValidacao)
routes.post('/validarEmail', userController.validarEmail)


module.exports = routes;
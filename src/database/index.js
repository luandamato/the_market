const Sequelize = require('sequelize');
const config = require('../config/database');

const User =  require('../models/User');
const Produto =  require('../models/Produto');
const Mensagem =  require('../models/Mensagem');
const Endereco =  require('../models/Endereco');

const connection = new Sequelize(config);

User.init(connection);
Produto.init(connection);
Mensagem.init(connection);
Endereco.init(connection);

User.associate(connection.models);
Produto.associate(connection.models);
Mensagem.associate(connection.models);
Endereco.associate(connection.models);

module.exports = connection;
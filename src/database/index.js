const Sequelize = require('sequelize');
const config = require('../config/database');

const User =  require('../models/User');
const Produto =  require('../models/Produto');

const connection = new Sequelize(config);

User.init(connection);
Produto.init(connection);

User.associate(connection.models);
Produto.associate(connection.models);

module.exports = connection;
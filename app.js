const express = require('express');
const path = require('path');
const rotas = require('./src/routes')
var bodyParser = require('body-parser');

require('./src/database');




class AppController {
    constructor() {
      this.express = express();
  
      this.middlewares();
      this.routes();
    }
  
    middlewares() {
        this.express.use(express.static(path.join(__dirname, 'views')));
        this.express.set('views', path.join(__dirname, 'views'))
        this.express.engine('html', require('ejs').renderFile);
        this.express.set('view engine', 'hmtl')
        this.express.use(express.json());
        this.express.use(bodyParser.urlencoded({
            extended: true
          }));
          this.express.use(bodyParser.json());
    }
  
    routes() {
        this.express.use(rotas);
    }
  }
  
  module.exports = new AppController().express;
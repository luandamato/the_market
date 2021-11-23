const express = require('express');
const path = require('path');
const rotas = require('./src/routes')
var bodyParser = require('body-parser');

const passport = require('passport')
const session = require('express-session')
require("./auth")(passport)


require('./src/database');


class AppController {
    constructor() {
      this.express = express();
  
      this.middlewares();
      this.session();
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

    
    session(){
      this.express.use(session({
        secret: "12345",
        resave: false,
        saveUninitialized: false,
        cookie: {maxAge: 2 * 60 * 1000}
      }))

      this.express.use(passport.initialize());
      this.express.use(passport.session());
    }
  
    routes() {
        this.express.use(rotas);
    }

  }
  
  module.exports = new AppController().express;
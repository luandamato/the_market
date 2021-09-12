const express = require('express');
const path = require('path');
const rotas = require('./src/routes')
var bodyParser = require('body-parser');

require('./src/database');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
app.use(express.static(path.join(__dirname, 'views')));
app.set('views', path.join(__dirname, 'views'))
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'hmtl')
app.use(express.json());
app.use(bodyParser.urlencoded({
    extended: true
  }));

app.use(rotas);
io.on('connection', socket =>{
    require('./Controllers/socket')(socket);
})

server.listen(process.env.PORT || 4000, ()=> {
    console.log("rodando no porta " + process.env.PORT || 4000)
})
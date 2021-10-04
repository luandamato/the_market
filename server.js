const app = require("./app");

const server = require('http').createServer(app);
const io = require('socket.io')(server);

io.on('connection', socket =>{
    require('./Controllers/socket')(socket);
})

server.listen(process.env.PORT || 4000, ()=> {
    console.log("rodando no porta " + process.env.PORT || 4000)
})
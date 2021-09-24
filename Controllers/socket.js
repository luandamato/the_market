const User = require('../src/models/User');
const Mensagem = require('../src/models/Mensagem');
const Op = require('sequelize').Op
const helper = require('../src/helper.js');

let mensagens =  []
let conexoes = []
let androidTokens = []

module.exports= function(socket){

    socket.emit('mensagensAnteriores', mensagens);
    socket.emit('conexoesAnteriores', conexoes);


    socket.on('conectar', async data => {
        await atualizarSocketId(data)
    });

    socket.on('digitando', data => {
        console.log(data);
        socket.broadcast.emit("digitando", data)
    });

    socket.on('parouDigitar', data => {
        socket.broadcast.emit("parouDigitar", data)
    });


    socket.on('enviarMensagem', async data =>{
        const msg = await cadastrar(data);
        if (msg){
            socket.emit('mensagemRecebida', msg);
            socket.to(msg.socket).emit('mensagemRecebida', msg);
        }
        
        
    })

    socket.on('disconnect', function() {
    
        const element = conexoes.find(item => item.id == socket.id)
        var i = conexoes.indexOf(element);
        console.log(conexoes, element)

        if (!element){
            return;
        }
        var data = {};
        data.nome = element.nome;
        data.id = element.id;

        conexoes.splice(i, 1);

        socket.broadcast.emit("desconectado", data)
        socket.broadcast.emit("parouDigitar", data)
    });

    

}

async function cadastrar(data){
    try{
        const user_id = data.id;
        const user2_id = data.user2;
        const mensagem = data.msg;
        const imagem = data.img;

        console.log(user_id, user2_id, imagem, mensagem);
        if (!user_id || !user2_id || (!imagem && !mensagem)){
            console.log("ERRO: faltando parametros");
            return;
        }
        
        const msg = await Mensagem.create({ user_id, user2_id, mensagem, imagem});
        const user = await User.findByPk(user2_id)
        msg.socket = user.socket_id;

        return msg;
    } catch (error) {
        throw error
    }
};

async function atualizarSocketId(data){
    try{
        await User.update({
            socket_id: data.socketId,
        }, {
            where: {
                id: data.id
            }
        })
    } catch (error) {
        throw error
    }
};
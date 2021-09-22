let mensagens =  []
let conexoes = []
let androidTokens = []

module.exports= function(socket){

    socket.emit('mensagensAnteriores', mensagens);
    socket.emit('conexoesAnteriores', conexoes);


    socket.on('conectar', data => {
        console.log(data);
        conexoes.push(data);
        androidTokens.push(data.pushTokenId);
        socket.broadcast.emit("novaConexao", data)
    });

    socket.on('digitando', data => {
        console.log(data);
        socket.broadcast.emit("digitando", data)
    });

    socket.on('parouDigitar', data => {
        socket.broadcast.emit("parouDigitar", data)
    });


    socket.on('enviarMensagem', data =>{
        mensagens.push(data);
        socket.broadcast.emit('mensagemRecebida', data);
        // if (androidTokens.length > 0){
        //     var push = {}
        //     push.title = data.nome;
        //     push.body = data.msg;
        //     push.code = 3
        //     push.token = androidTokens;
        //     fun.AndroidPushNotificationMultiple(push)
        // }
        
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
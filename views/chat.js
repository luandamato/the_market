var conexoes = [];
var pessoasDigitando = [];
var ultimoAEnviar = "";
var base64 = "";

function getQueryString() {
    var result = {}, queryString = location.search.slice(1),
        re = /([^&=]+)=([^&]*)/g, m;

    while (m = re.exec(queryString)) {
        result[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }

    return result;
}

//var nome = getQueryString()["username"];
var nome = localStorage.getItem("username");
//alert("Logado como: "+nome);
document.getElementById('nome').value = nome;

var socket = io('http://127.0.0.1:4000/');

function scroll(limit){
    const out = document.getElementById("messages")
    //se esta no bottom da div
    const isScrolledToBottom = out.scrollHeight - out.clientHeight <= out.scrollTop + limit

    if (isScrolledToBottom) {
        //setta o scroll
        out.scrollTop = out.scrollHeight - out.clientHeight
    }
}

function renderMessage(message) {
    var scrollLimit = 120
    if (message.id == socket.id){
        if (message.msg){
            $('.messages').append('<div class="messageEnviada">'+message.msg+'</div>')
        }
        else{
            scrollLimit = 450
            $('.messages').append('<div class="messageEnviada"><img class="img" style="border-radius: 10px;" src="data:image/png;base64,'+message.img+'" alt="Red dot" /></div>')
        }
    }
    else{
        if (ultimoAEnviar != message.nome){
            $('.messages').append('<div><strong>'+ message.nome +'</strong>: </div>')
        }
        if (message.msg){
            $('.messages').append('<div class="message">'+message.msg+'</div>')
        }
        else{
            scrollLimit = 450
            $('.messages').append('<div class="messageImg"> <img class="img" style="border-radius: 10px;" src="data:image/png;base64,'+message.img+'" alt="Red dot" /> </div>')
            
        }
        $('.messages').append('<br>')
    }
    ultimoAEnviar = message.nome;
    scroll(scrollLimit)
    
}

function atualizarPessoasDigitando(){
    $('.pessoasDigitandoAtual').remove();
    var str = "";
    if (pessoasDigitando.length == 0){
        return false;
    }
    if (pessoasDigitando.length > 4){
        str = "Diversas pessoas estão digitando...";
    }
    else{
        pessoasDigitando.forEach(element => {
            if (str){
                str =  str + ",";
            }
            str += element;
        });
        if (pessoasDigitando.length == 1){
                str = str + " está digitando...";
            }
            else{
                str = str + " estão digitando...";
            }
    }
    $('.pessoasDigitando').append('<div class="pessoasDigitandoAtual">'+str+'</div>')
}

function atualizarPessoasOnline(){
    $('.pessoasOnline').remove();
    var str = "Voce";
    conexoes.forEach(element => {
        if (str){
            str =  str + ", ";
        }
        str += element.nome;
    });
    $('.pessoasConectadas').append('<div class="pessoasOnline">'+str+'</div>')
    scroll(80)
}


socket.on('mensagemRecebida', function(message){
    renderMessage(message)
})

socket.on('conexoesAnteriores', function(messages){
    for (message of messages){
        conexoes.push(message)
    }
    atualizarPessoasOnline()
})

socket.on('novaConexao', function(message){
    conexoes.push(message)
    $('.messages').append('<div class="novoUsuario">'+message.nome+' Entrou </div>')
    ultimoAEnviar = ""
    atualizarPessoasOnline()
})

socket.on('desconectado', function(message){
    const element = conexoes.find(item => item == message)
    var i = conexoes.indexOf(element);
    conexoes.splice(i, 1);
    ultimoAEnviar = ""
    $('.messages').append('<div class="novoUsuario">'+message.nome+' Saiu </div>')
    atualizarPessoasOnline()
})

socket.on('digitando', function(message){
    pessoasDigitando.push(message.nome);
    atualizarPessoasDigitando()
})

socket.on('parouDigitar', function(message){
    const element = pessoasDigitando.find(item => item == message.nome)
    var i = pessoasDigitando.indexOf(element);
    pessoasDigitando.splice(i, 1);
    atualizarPessoasDigitando()
})


socket.on('connect', function(message){
    var id = socket.id;
    var object = {
            nome, 
            id,
        };
        socket.emit('conectar', object);
})

socket.on('mensagensAnteriores', function(messages){
    for (message of messages){
        renderMessage(message)
    }
    const out = document.getElementById("messages")
    out.scrollTop = out.scrollHeight - out.clientHeight

    
})

$('#chat').submit(function(event) {
    event.preventDefault();

    var msg = $('input[name=message').val();
    var id = socket.id;

    if (nome.length){
        if (msg.length){
            var object = {
                nome, 
                msg,
                id,
            };
        }
        else if (base64.length){
            const img = base64
            var object = {
                nome, 
                img,
                id,
            };
            toggle(false);
        }
        base64 = ""
        renderMessage(object);
        
        socket.emit('enviarMensagem', object);
    }
    document.getElementById('msg').value = null;
    isTyping(false)
})

var digitando = false;
var $input = $('#msg');

//on keyup, start the countdown
$input.on('keyup', function () {

    var id = socket.id;
    var object = {
        nome, 
        id,
    };
    if (!digitando && $input.val()){
        socket.emit('digitando', object);
        digitando = true;
        isTyping(true)
    }
    else if (!$input.val()){
        socket.emit('parouDigitar', object);
        digitando = false;
        isTyping(false)
    }

});


function stringToBase64(file){
    var preview = document.getElementById("previewImg");
    //var file    = document.querySelector('input[type=file]').files[0];
    var reader  = new FileReader();

    reader.onloadend = function () {
        preview.src = reader.result;
        base64 = reader.result.split('base64,')[1]
        //toggle()
    }

    if (file) {
        reader.readAsDataURL(file);
        isTyping(true)
        toggle(true)
    } else {
        preview.src = "";
        isTyping(false)
        toggle(false)
    }
}

function dragOverHandler(ev) {
    toggle(true)
    // Impedir o comportamento padrão (impedir que o arquivo seja aberto)
    ev.preventDefault();
}

function dropHandler(ev) {

    // Impedir o comportamento padrão (impedir que o arquivo seja aberto)
    ev.preventDefault();
    if (ev.dataTransfer.items) {
        // Use a interface DataTransferItemList para acessar o (s) arquivo (s)
        for (var i = 0; i < ev.dataTransfer.items.length; i++) {
        // Se os itens soltos não forem arquivos, rejeite-os
            if (ev.dataTransfer.items[i].kind === 'file') {
                var file = ev.dataTransfer.items[i].getAsFile();
                stringToBase64(file)
                isTyping(true)
            }
        }
    } else {
        // Use a interface DataTransfer para acessar o (s) arquivo (s)
        for (var i = 0; i < ev.dataTransfer.files.length; i++) {
            stringToBase64(ev.dataTransfer.files[i])
            isTyping(true)
            console.log('... file[' + i + '].name = ' + ev.dataTransfer.files[i].name);
        }
    }
}

function toggle(showImage) {
    var preview = document.getElementById("previewImg");
    var x = document.getElementById("messages");
    var y = document.getElementById("previewImage");
    var text = document.getElementById("msg");
    if (!showImage) {
        text.style.display = "block";
        y.style.display = "none";
        base64 = ""
        preview.src = "";
    } else {
        text.style.display = "none";
        y.style.display = "block";
    }
    isTyping(showImage)
}

function isTyping(val) {
    digitando = val
    var send = document.getElementById("btnEnviar");
    var img = document.getElementById("choseImage");
    if (val) {
        send.style.display = "block";
        img.style.display = "none";
    } else {
        send.style.display = "none";
        img.style.display = "block";

        var id = socket.id;
        var object = {
            nome, 
            id,
        };
        socket.emit('parouDigitar', object);
    }
}

$("#file-input").change( function() {
    if (this.files && this.files[0]) {
        stringToBase64(this.files[0])
    }
});
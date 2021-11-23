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
var id = localStorage.getItem("userId");
var id2 = ""
//alert("Logado como: "+nome);
document.getElementById('nome').value = nome;

getConversas();

//var socket = io('http://127.0.0.1:4000/');
var socket = io('https://the-market-lab.herokuapp.com/');

//rest

function getConversas(){
    document.getElementById('inbox_chat').innerHTML = ""
    callApiGet('/conversas/historico/'+id, function(response){
        if (response.data.historico){
            var conversas = response.data.historico;
            conversas.map((val)=>{
                var img = 'https://ptetutorials.com/images/user-profile.png';
                if(val.foto){
                    img = 'data:image/png;base64,'+val.foto
                }

                document.getElementById('inbox_chat').innerHTML += ''+
                    '<div class="chat_list" id="conversa'+ val.id +'" onclick="carregarConversa('+ val.id +')">'+
                        '<div class="chat_people">'+
                            '<div class="chat_img"> <img src="'+ img +'" alt="sunil"> </div>'+
                            '<div class="chat_ib">'+
                                '<h5>'+ val.nome +' <span class="chat_date">'+ '' +'</span></h5>'+
                                '<p>'+ val.username +'</p>'+
                            '</div>'+
                        '</div>'+
                    '</div>';
            })
        }
        
    });
}

function carregarConversa(user_id2){
    id2 = user_id2
    var cardsConversas = document.getElementsByClassName("chat_list")
    for (var i = 0; i < cardsConversas.length; i++) {
        cardsConversas[i].classList.remove("active_chat")
    }
    document.getElementById('search-bar').value = "";
    document.getElementById('inputMensagem').style.display = "block";


    var divId = "conversa"+id2
    var element = document.getElementById(divId);
    element.classList.add("active_chat")

    document.getElementById('msg_history').innerHTML = ""
    callApiGet('/conversa/'+id+'/'+id2, function(response){
        getConversas()
        if (response.data.mensagens){
            var mensagens = response.data.mensagens;
            mensagens.map((val)=>{
                renderMessage(val)
            })
        }
        
    });
}

$('.search-bar').on('keyup', function () {

    buscarUser()

});

function buscarUser(){
    var nome = document.getElementById("search-bar").value;
    if (!nome){
        getConversas()
        return;
    }
    callApiGet('/usersByName/'+nome, function(response){
        if (response.data.user){
            document.getElementById('inbox_chat').innerHTML = ''
            var users = response.data.user;
            users.map((val)=>{
                var img = 'https://ptetutorials.com/images/user-profile.png';
                if(val.foto){
                    img = 'data:image/png;base64,'+val.foto
                }

                document.getElementById('inbox_chat').innerHTML += ''+
                    '<div class="chat_list" id="conversa'+ val.id +'" onclick="carregarConversa('+ val.id +')">'+
                        '<div class="chat_people">'+
                            '<div class="chat_img"> <img src="'+ img +'" alt="sunil"> </div>'+
                            '<div class="chat_ib">'+
                                '<h5>'+ val.nome +' <span class="chat_date">'+ '' +'</span></h5>'+
                                '<p>'+ val.username +'</p>'+
                            '</div>'+
                        '</div>'+
                    '</div>';
            })
        }
        
    });
}

function callApiGet(url, callback){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.onload = function(){
        if(xhr.status == 200){
            callback(JSON.parse(xhr.response));
        } else if(xhr.status == 405) {
            //logout()
            if (JSON.parse(xhr.response).direcionar == "home") {
                goHome()
            }
            else{
                goLogin()
            }
        } else {
            //TODO: tratar os possíveis erros
            alert("ERRO: "+xhr.status + "\n"+url);
        }
    }
    xhr.send();
}
// socket

function scroll(limit){
    const out = document.getElementById("msg_history")
    //se esta no bottom da div
    const isScrolledToBottom = out.scrollHeight - out.clientHeight <= out.scrollTop + limit

    if (isScrolledToBottom) {
        //setta o scroll
        out.scrollTop = out.scrollHeight - out.clientHeight
    }
}

function renderMessage(message) {
    var scrollLimit = 300
    var date = new Date(message.updatedAt)
    var horario = ''+date.getHours()+':'+date.getMinutes() +'    |    '+ date.getDate()+'/'+ date.getMonth()+''
    if (message.user_id == id){
        if (message.mensagem){
            $('.msg_history').append('<div class="outgoing_msg">'+
                                        '<div class="sent_msg">'+
                                            '<p>'+ message.mensagem +'</p>'+
                                            '<span class="time_date"> '+ horario +'</span> </div>'+
                                        '</div>')
        }
        else{
            var imagem = blobToBase64(message.imagem)
            scrollLimit = 800
            $('.msg_history').append('<div class="outgoing_msg">'+
            '<div class="sent_msg">'+
                '<img src="data:image/png;base64,'+message.imagem+'" alt="sunil">'+
                '<span class="time_date"> '+ horario +'</span> </div>'+
            '</div>')
        }
    }
    else{
        var foto = '<div class="incoming_msg">'
        // if (ultimoAEnviar != message.nome){
        //     foto += '<div class="incoming_msg_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"> </div>'
        // }
        if (message.mensagem){
            $('.msg_history').append(foto+
            '<div class="received_msg">'+
                '<div class="received_withd_msg">'+
                '<p>'+ message.mensagem +'</p>'+
                '<span class="time_date"> '+ horario +'</span> </div>'+
            '</div>'+
            '</div>')
        }
        else{
            var imagem = blobToBase64(message.imagem)
            scrollLimit = 800
            $('.msg_history').append(foto+
                '<div class="received_msg">'+
                    '<div class="received_withd_msg">'+
                    '<img src="data:image/png;base64,'+message.imagem+'" alt="sunil">'+
                    '<span class="time_date"> '+ horario +'</span> </div>'+
                '</div>'+
                '</div>')
        }
        $('.msg_history').append('<br>')
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
    if ((message.user_id == id && message.user2_id == id2) || (message.user_id == id2 && message.user2_id == id))
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
    $('.msg_history').append('<div class="novoUsuario">'+message.nome+' Entrou </div>')
    ultimoAEnviar = ""
    atualizarPessoasOnline()
})

socket.on('desconectado', function(message){
    const element = conexoes.find(item => item == message)
    var i = conexoes.indexOf(element);
    conexoes.splice(i, 1);
    ultimoAEnviar = ""
    $('.msg_history').append('<div class="novoUsuario">'+message.nome+' Saiu </div>')
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
    var socketId = socket.id;
    var object = {
            nome, 
            id,
            socketId
        };
        socket.emit('conectar', object);
})

socket.on('mensagensAnteriores', function(messages){
    for (message of messages){
        renderMessage(message)
    }
    const out = document.getElementById("msg_history")
    out.scrollTop = out.scrollHeight - out.clientHeight
 
})

$('#chat').submit(function(event) {
    event.preventDefault();

    var msg = $('input[name=message').val();

    if (nome.length){
        if (msg.length){
            var object = {
                nome, 
                msg,
                id,
                user2: id2,
            };
        }
        else if (base64.length){
            const img = base64
            var object = {
                nome, 
                img,
                id,
                user2: id2,
            };
            toggle(false);
        }
        base64 = ""
        
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

function blobToBase64(blob){

    return new Promise((resolve, _) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
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
            //console.log('... file[' + i + '].name = ' + ev.dataTransfer.files[i].name);
        }
    }
}

function toggle(showImage) {
    var preview = document.getElementById("previewImg");
    var x = document.getElementById("msg_history");
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

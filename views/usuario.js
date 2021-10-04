
function getUser(){
    var userId = getQueryString()["userId"];
    if (!userId){
        const user = getUserLogado();
        if (user){
            userId = user.id
        }
    }
    if(!userId){
        alert("Usuário não informado")
        window.location.href = "Home.html";
        return;
    }
    callApiGet('/user/'+userId, function(response){
        addUser(response.data.user);
    });
}

function addUser(user){
    const usuarioLogado = getUserLogado();
    var containerProdutos = document.getElementById("user-card")
    var img = "https://img.icons8.com/bubbles/100/000000/user.png";
    if (user.imagem){
        img = user.imagem
    }

    var editar = "";
    if (usuarioLogado && usuarioLogado.id == user.id){
        editar = '<a href="EditarPerfil.html" style="font-size:12px; color:black;">Editar Perfil</a>'
    }
    
    containerProdutos.innerHTML += ''+
    '<div class="row m-l-0 m-r-0">'+
        '<div class="col-sm-4 bg-c-lite-green user-profile">'+
            '<div class="card-block text-center text-white">'+
                '<div class="m-b-25"> <img src="'+ img +'" class="img-radius" alt="User-Profile-Image"> </div>'+
                '<h6 class="f-w-600">'+ user.username + '</h6>'+
                editar +
            '</div>'+
        '</div>'+
        '<div class="col-sm-8">'+
            '<div class="card-block">'+
                '<h6 class="m-b-20 p-b-5 b-b-default f-w-600">Informações</h6>'+
                '<div class="row">'+
                    '<div class="col-sm-6">'+
                        '<p class="m-b-10 f-w-600">Email</p>'+
                        '<h6 class="text-muted f-w-400">'+ user.email +'</h6>'+
                    '</div>'+
                    '<div class="col-sm-6">'+
                        '<p class="m-b-10 f-w-600">Telefone</p>'+
                        '<h6 class="text-muted f-w-400">'+ user.telefone +'</h6>'+
                    '</div>'+
                '</div>'+
                '<div class="" style="text-align: justify;">'+
                    '<p class="m-b-10 f-w-600">Bio</p>'+
                    '<h6 class="text-muted f-w-400">'+ user.bio +'</h6>'+
                '</div>'+
                '<h6 class="m-b-20 m-t-40 p-b-5 b-b-default f-w-600"></h6>'+
                '<div class="row">'+
                    '<div class="col-sm-6">'+
                        '<p class="m-b-10 f-w-600">Total de Vendas</p>'+
                        '<h6 class="text-muted f-w-400">'+ 0 +'</h6>'+
                    '</div>'+
                    '<div class="col-sm-6">'+
                        '<p class="m-b-10 f-w-600">Produtos anunciados</p>'+
                        '<h6 class="text-muted f-w-400">'+ user.qtdProdutos +'</h6>'+
                    '</div>'+
                    '<div class="col-sm-6">'+
                        '<p class="m-b-10 f-w-600">Total de compras</p>'+
                        '<h6 class="text-muted f-w-400">'+ 0 +'</h6>'+
                    '</div>'+
                '</div>'+
                '<ul class="social-link list-unstyled m-t-40 m-b-10">'+
                '</ul>'+
            '</div>'+
       ' </div>'+
    '</div>';
}




function getQueryString() {
    var result = {}, queryString = location.search.slice(1),
        re = /([^&=]+)=([^&]*)/g, m;

    while (m = re.exec(queryString)) {
        result[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }

    return result;
}

function saveData(key, value){
    //alert("salvando "+value+"como "+key)
    localStorage.setItem(key, value);
}

function setUser(user){
    //alert("salvando "+value+"como "+key)
    console.log(JSON.stringify(user));
    localStorage.setItem("user", JSON.stringify(user));
}

function getUserLogado(){
    if (getData("user")){
        return JSON.parse(getData("user"));
    }
}

function getData(key){
    var item = localStorage.getItem(key);
    //alert("recuperado "+key+" como "+item)
    return item;
}

function goProfile(id){
    window.location.href = "Perfil.html?userId="+id;
}

//----------------------Editar Pefil--------------------------------
function editarInfos(){
    var user = getUserLogado();
    if (!user){
        return;
    }

    var id = user.id;
    var username = document.getElementById("username").value;
    var nome = document.getElementById("nome").value;
    var sobrenome = document.getElementById("sobrenome").value;
    var email = document.getElementById("email").value;
    var telefone = document.getElementById("telefone").value;
    var cpf = document.getElementById("cpf").value;
    var nascimento = document.getElementById("nasimento").value;
    var bio = document.getElementById("bio").value;

    var nomeCompleto = nome + " " + sobrenome;

    if (nomeCompleto.split(" ").length < 2 || !nome || !sobrenome){
        alert("preencha nome e sobrenome")
        return;
    }


    var body = {
        username,
        nome: nomeCompleto,
        email,
        telefone,
        cpf,
        nascimento,
        bio,
        id
    }
    console.log(body);
    callApiPost('/atualizarUser/', body, function(response){
        goProfile(id);
    });
}

function editarEnd(pId, pNome, pCep, pRua, pBairro, pNumero, pComplemento, pCidade, pEstado){
    var user = getUserLogado();
    if (!user){
        return;
    }
    var userId = user.id;
    
    const id = pId.value
    const nome = pNome.value
    const zip = pCep.value
    const rua = pRua.value
    const bairro = pBairro.value
    const numero = pNumero.value
    const complemento = pComplemento.value
    const cidade = pCidade.value
    const estado = pEstado.value
    const pais = "br"
    
    var body = {
        id,
        zip,
        nome,
        rua,
        bairro,
        numero,
        complemento,
        cidade,
        estado,
        pais
    }
    console.log(body);
    callApiPost('/atualizarEndereco', body, function(response){
        goProfile(userId);
    });
    return false;
}

function novoEndereco(pId, pNome, pCep, pRua, pBairro, pNumero, pComplemento, pCidade, pEstado){
    var user = getUserLogado();
    if (!user){
        return;
    }
    var user_id = user.id;
    
    const id = pId.value
    const nome = pNome.value
    const zip = pCep.value
    const rua = pRua.value
    const bairro = pBairro.value
    const numero = pNumero.value
    const complemento = pComplemento.value
    const cidade = pCidade.value
    const estado = pEstado.value
    const pais = "br"
    
    var body = {
        id,
        zip,
        nome,
        rua,
        bairro,
        numero,
        complemento,
        cidade,
        estado,
        user_id,
        pais
    }
    console.log(body);
    callApiPost('/novoEndereco', body, function(response){
        goProfile(user_id);
    });
    return false;
}

function excluirEndereco(id){
    var user = getUserLogado();
    if (!user){
        return;
    }

    callApiPost('/excluirEndereco', {id}, function(response){
        window.location.reload(false);
    });
}




function callApiPost(url, body, callback){
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.responseType = 'json';
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function(){
        if(xhr.status == 200){
            if (xhr.response.msg != "sucesso"){
                alert(xhr.response.msg);
            }
            callback(xhr.response);
        } else {
            //TODO: tratar os possíveis erros
            alert(xhr.response.msg);
        }
    }
    xhr.send(JSON.stringify(body));
}

function callApiGet(url, callback){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.onload = function(){
        if(xhr.status == 200){
            callback(JSON.parse(xhr.response));
        } else {
            //TODO: tratar os possíveis erros
            alert("ERRO: "+xhr.status + "\n"+url);
        }
    }
    xhr.send();
}
function cadastrarProduto(){
    var nome = document.getElementById("nome").value;
    var preco = document.getElementById("preco").value;
    var descricao = document.getElementById("descricao").value;
    var usado = document.querySelector('input[name="usado"]:checked').value;
    var desativar_ao_vender = document.querySelector('input[name="desativar_ao_vender"]:checked').value;
    //var img = document.getElementById("img").value;
    var user = getUserLogado();
    if (!user){
        return;
    }
    var anunciante_id = user.id;

    var body = {
        nome,
        preco,
        descricao,
        usado,
        desativar_ao_vender,
        anunciante_id

    }
    callApiPost('/produto',  body, function(response){
        console.log(response)
        goHome();
    });
}


function getQueryString() {
    var result = {}, queryString = location.search.slice(1),
        re = /([^&=]+)=([^&]*)/g, m;

    while (m = re.exec(queryString)) {
        result[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }

    return result;
}


function getProduto(){
    var produtoId = getQueryString()["produtoId"];
    callApiGet('/produto/'+produtoId, function(response){
        console.log(response.data.produto)
        addProduct(response.data.produto);
    });
}

function addProduct(produto){
    var containerProdutos = document.getElementById("produto")
    var novo = "Produto novo"
    if (produto.usado){
        novo = "Produto Usado"
    }
    var img = "./img/produto.png";
    if (produto.imagem){
        img = produto.imagem
    }
    
    containerProdutos.innerHTML += ''+
    '<div class="col-2">'+
        '<img src = "'+ img +'" width="100%" id="productImg">'+
        '<div class="small-img-row">'+
            '<div class="small-img-col">'+
                '<img class="small-img" src="'+ img +'" width="100%">'+
            '</div>'+
            '<div class="small-img-col">'+
                '<img class="small-img" src="'+ img +'" width="100%">'+
            '</div>'+
            '<div class="small-img-col">'+
                '<img class="small-img" src="'+ img +'" width="100%">'+
            '</div>'+
        '</div>'+
    '</div>'+
    '<div class="col-2">'+
        '<h1>'+ produto.nome +'</h1>'+
        '<h4>R$ '+ produto.preco +'</h4>'+
        '<h5>'+ novo +'</h4>'+
        '<input type="number" value="1">'+
        '<a href="" class="btn">Comprar</a>'+
        '<h3>Detalhes<i class="fa fa-indent"></i></h3>'+
        '<br>'+
        '<p id="detalhe">'+ produto.descricao +'</p>'+
        '<br><br>'+
        '<div style="cursor: pointer;" onclick="goProfile('+ produto.user.id +')">'+
            '<p id="anunciante">Anunciado por: <a href=""></a>'+ produto.user.nome +'</a></p>'+
        '</div>'+
    '</div>';
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

function callApiPost(url, body, callback){
    console.log(JSON.stringify(body))
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
        } else if(xhr.status == 405) {
            logout()
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
            console.log(xhr)
            callback(JSON.parse(xhr.response));
        } else if(xhr.status == 405) {
            goHome()
        } else {
            //TODO: tratar os possíveis erros
            alert("ERRO: "+xhr.status);
        }
    }
    xhr.send();
}

function getUsers(){
    const user = getUserLogado();
    var username = "" 
    if (user){
        username = user.username
    }
    if(!username){
        alert("Usuário não informado")
        window.location.href = "Home.html";
        return;
    }
    
    const adm = username === "admin"
    callApiGet('/listUsers/'+ adm, function(response){
        addUsers(response.data.users);
    });
}

function addUsers(users){
    console.log(users);
    var i = 1;
    var retorno = '<h3 class="mb-4">Usuários</h3>';
    console.log(retorno);
    users.map((val)=>{
        var end = ''+
        '    <button class="collapsible btn btn-primary " style="float: right">'+ val.nome +'</button>'+
        '    <div class="contentEndereco">'+
        '        <input type="hidden" name="id" value="'+ val.id +'">'+
        '            <div class="form-container">'+
        '                <div class="row">'+
        '                    <div class="col-md-6">'+
        '                        <div class="form-group">'+
        '                            <label>username</label>'+
        '                            <input type="text" class="form-control" value="'+ val.username +'" name="nome" >'+
        '                        </div>'+
        '                    </div>'+
        '                    <div class="col-md-6">'+
        '                        <div class="form-group">'+
        '                            <label>cpf</label>'+
        '                            <input type="text" class="form-control" value="'+ val.cpf +'" name="nome" >'+
        '                        </div>'+
        '                    </div>'+
        '                </div>'+
        '                <div class="row">'+
        '                    <div class="col-md-6">'+
        '                        <div class="form-group">'+
        '                            <label>email</label>'+
        '                            <input type="text" class="form-control" value="'+ val.email +'" name="cep">'+
        '                        </div>'+
        '                    </div>'+
        '                    <div class="col-md-6">'+
        '                        <div class="form-group">'+
        '                            <label>telefone</label>'+
        '                            <input type="text" class="form-control" value="'+ val.telefone +'" name="cep">'+
        '                        </div>'+
        '                    </div>'+
        '                </div>'+
        '                <div class="row">'+
        '                    <div class="col-md-6">'+
        '                        <div class="form-group">'+
        '                            <label>nascimento</label>'+
        '                            <input type="text" class="form-control" value="'+ val.nascimento +'" name="rua" >'+
        '                        </div>'+
        '                    </div>'+
        '                </div>'+
        '                <div class="row">'+
        '                    <div class="col-md-6">'+
        '                        <div class="form-group">'+
        '                            <label>enderecos</label>'+
        '                            <input type="text" class="form-control" value="'+ val.enderecos.length +'" name="complemento">'+
        '                        </div>'+
        '                    </div>'+
        '                    <div class="col-md-6">'+
        '                        <div class="form-group">'+
        '                            <label>produtos</label>'+
        '                            <input type="text" class="form-control" value="'+ val.produtos.length +'" name="cidade">'+
        '                        </div>'+
        '                    </div>'+
        '                </div>'+
        '                    <div class="card-wrapper"></div>'+
        '                </div>'+
        '            </div>'+
        '    </div> .';

        retorno += end;
        retorno += '<hr>'

        i += 1;
    })

    console.log(retorno);

    const container = document.getElementById("users");
    container.innerHTML += retorno
    return retorno;
    
}


function callApiGet(url, callback){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.onload = function(){
        if(xhr.status == 200){
            callback(JSON.parse(xhr.response));
        } else if(xhr.status == 405) {
            if (JSON.parse(xhr.response).msg != "sucesso"){
                alert(JSON.parse(xhr.response).msg);
            }
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

getUsers()
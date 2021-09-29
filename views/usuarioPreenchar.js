getUser()

function getUser(){
    const user = getUserLogado();
    var userId = "" 
    if (user){
        userId = user.id
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
function getUserLogado(){
    if (getData("user")){
        return JSON.parse(getData("user"));
    }
}

function addUser(user){
    const container = document.getElementById("v-pills-tabContent");

    const infos = getInfos(user)
    container.innerHTML += infos
}

function getInfos(user){ 
    var date = new Date(user.nascimento)
    date.setMonth(date.getMonth() +1)
    date.setDate(date.getDate() +1)
    console.log(date)
    const mesFormatado = date.getMonth().toLocaleString('pt-BR', {
        minimumIntegerDigits: 2,
        useGrouping: false
      })
    const nascimento = ''+date.getFullYear()+'-'+ mesFormatado +'-'+ date.getDate()+'';
    console.log(nascimento)
    var nome = user.nome
    var sobrenome = ""
    if (user.nome.split(" ").length >= 2){
        nome = user.nome.split(" ")[0];
        sobrenome = user.nome.substr(user.nome.indexOf(" ") + 1);;
    }
    
    const cpf = user.cpf;
    const email = user.email;
    const telefone = user.telefone;
    const username = user.username;
    const bio = user.bio;
    var infos = ''+
       '    <div class="tab-pane fade show active" id="account" role="tabpanel" aria-labelledby="account-tab">'+
       '    <h3 class="mb-4">Configurações da conta</h3>'+
       '    <div class="row">'+
       '        <div class="col-md-6">'+
       '            <div class="form-group">'+
       '                <label>Username</label>'+
       '                <input type="text" class="form-control" id="username" value="'+ username +'">'+
       '            </div>'+
       '        </div>'+
       '    </div>'+
       '    <div class="row">'+
       '        <div class="col-md-6">'+
       '            <div class="form-group">'+
       '                <label>Nome</label>'+
       '                <input type="text" class="form-control" id="nome" value="'+ nome +'">'+
       '            </div>'+
       '        </div>'+
       '        <div class="col-md-6">'+
       '            <div class="form-group">'+
       '                <label>Sobrenome</label>'+
       '                <input type="text" class="form-control" id="sobrenome" value="'+ sobrenome +'">'+
       '            </div>'+
       '        </div>'+
       '        <div class="col-md-6">'+
       '            <div class="form-group">'+
       '                <label>Email</label>'+
       '                <input type="text" class="form-control" id="email" value="'+ email +'">'+
       '            </div>'+
       '        </div>'+
       '        <div class="col-md-6">'+
       '            <div class="form-group">'+
       '                <label>telefone</label>'+
       '                <input type="text" class="form-control" id="telefone" value="'+ telefone +'">'+
       '            </div>'+
       '        </div>'+
       '        <div class="col-md-6">'+
       '            <div class="form-group">'+
       '                <label>CPF</label>'+
       '                <input type="text" class="form-control" id="cpf" value="'+ cpf +'">'+
       '            </div>'+
       '        </div>'+
       '        <div class="col-md-6">'+
       '            <div class="form-group">'+
       '                <label>Nascimento</label>'+
       '                <input type="date" class="form-control" id="nasimento" value="'+ nascimento +'">'+
       '            </div>'+
       '        </div>'+
       '        <div class="col-md-12">'+
       '            <div class="form-group">'+
       '                <label>Bio</label>'+
       '                <textarea class="form-control" rows="3" id="bio"> '+ bio +'</textarea>'+
       '            </div>'+
       '        </div>'+
       '    </div>'+
       '    <div>'+
       '        <button class="btn btn-primary" onclick="editarInfos()">Atualizar</button>'+
       '        <button class="btn btn-light">Cancelar</button>'+
       '    </div>'+
       '</div>';

       return infos;
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
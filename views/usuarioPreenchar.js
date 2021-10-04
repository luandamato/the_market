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
    const end = getEnd(user.enderecos)


    container.innerHTML += infos
    container.innerHTML += end
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
       '                <input type="email" class="form-control" id="email" value="'+ email +'">'+
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

function getEnd(enderecos){
    console.log(enderecos);
    var i = 1;
    var retorno = '<div class="tab-pane fade" id="security" role="tabpanel" aria-labelledby="security-tab">'+
    '    <h3 class="mb-4">Endereços</h3>';
    console.log(retorno);
    enderecos.map((val)=>{
        var nome = "Endereco" + i 
        var complemento = "" 
        if (val.nome){
            nome = val.nome;
        }
        if (val.complemento){
            complemento = val.complemento;
        }

        var end = ''+
        '    <button class="collapsible btn btn-primary " style="float: right">'+ nome +'</button>'+
        '    <div class="contentEndereco">'+
        '        <form onsubmit="return editarEnd(id, nome, cep, rua, bairro, numero, complemento, cidade, estado)">'+
        '            <input type="hidden" name="id" value="'+ val.id +'">'+
        '            <div class="form-container">'+
        '                <div class="row">'+
        '                    <div class="col-md-6">'+
        '                        <div class="form-group">'+
        '                            <label>Nome do endereço</label>'+
        '                            <input type="text" class="form-control" value="'+ nome +'" name="nome" >'+
        '                        </div>'+
        '                    </div>'+
        '                </div>'+
        '                <div class="row">'+
        '                    <div class="col-md-6">'+
        '                        <div class="form-group">'+
        '                            <label>CEP</label>'+
        '                            <input type="text" class="form-control" value="'+ val.zip +'" name="cep">'+
        '                        </div>'+
        '                    </div>'+
        '                </div>'+
        '                <div class="row">'+
        '                    <div class="col-md-6">'+
        '                        <div class="form-group">'+
        '                            <label>Logradouro</label>'+
        '                            <input type="text" class="form-control" value="'+ val.rua +'" name="rua" >'+
        '                        </div>'+
        '                    </div>'+
        '                    <div class="col-md-6">'+
        '                        <div class="form-group">'+
        '                            <label>Bairro</label>'+
        '                            <input type="text" class="form-control" value="'+ val.bairro +'" name="bairro">'+
        '                        </div>'+
        '                    </div>'+
        '                    <div class="col-md-6">'+
        '                        <div class="form-group">'+
        '                            <label>N°</label>'+
        '                            <input type="text" class="form-control" value="'+ val.numero +'" name="numero">'+
        '                        </div>'+
        '                    </div>'+
        '                    <div class="col-md-6">'+
        '                        <div class="form-group">'+
        '                            <label>Complemento</label>'+
        '                            <input type="text" class="form-control" value="'+ complemento +'" name="complemento">'+
        '                        </div>'+
        '                    </div>'+
        '                    <div class="col-md-6">'+
        '                        <div class="form-group">'+
        '                            <label>Cidade</label>'+
        '                            <input type="text" class="form-control" value="'+ val.cidade +'" name="cidade">'+
        '                        </div>'+
        '                    </div>'+
        '                    <div class="col-md-6">'+
        '                        <div class="form-group">'+
        '                            <label>Estado</label>'+
        '                            <input type="text" class="form-control" value="'+ val.estado +'" name="estado">'+
        '                        </div>'+
        '                    </div>'+
        '                    <div class="card-wrapper"></div>'+
        '                </div>'+
        '            </div>'+
        '            <div>'+
        '                <button type="submit" class="btn btn-primary">Atualizar</button>'+
        '                <button type="cancel" class="btn btn-light">Cancelar</button>'+
        '                <button class="btn btn-light" style="float: right" onclick="excluir('+ val.id +')">excluir</button>'+
        '            </div>'+
        '        </form>'+
        '    </div> .';

        retorno += end;
        retorno += '<hr>'

        i += 1;
    })

    var novo = ''+
        '    <button class="collapsible btn btn-primary " style="float: right">Novo Endereco</button>'+
        '    <div class="contentEndereco">'+
        '        <form onsubmit="return novoEndereco(id, nome, cep, rua, bairro, numero, complemento, cidade, estado)">'+
        '            <div class="form-container">'+
        '                <div class="row">'+
        '                    <div class="col-md-6">'+
        '                        <div class="form-group">'+
        '                            <label>Nome do endereço</label>'+
        '                            <input type="text" class="form-control" value="" name="nome" id="nomeEndereco">'+
        '                        </div>'+
        '                    </div>'+
        '                </div>'+
        '                <div class="row">'+
        '                    <div class="col-md-6">'+
        '                        <div class="form-group">'+
        '                            <label>CEP</label>'+
        '                            <input type="text" class="form-control" value="" name="cep" id="cep">'+
        '                        </div>'+
        '                    </div>'+
        '                </div>'+
        '                <div class="row">'+
        '                    <div class="col-md-6">'+
        '                        <div class="form-group">'+
        '                            <label>Logradouro</label>'+
        '                            <input type="text" class="form-control" value="" name="rua" id="rua">'+
        '                        </div>'+
        '                    </div>'+
        '                    <div class="col-md-6">'+
        '                        <div class="form-group">'+
        '                            <label>Bairro</label>'+
        '                            <input type="text" class="form-control" value="" name="bairro" id="bairro">'+
        '                        </div>'+
        '                    </div>'+
        '                    <div class="col-md-6">'+
        '                        <div class="form-group">'+
        '                            <label>N°</label>'+
        '                            <input type="text" class="form-control" value="" name="numero" id="numero">'+
        '                        </div>'+
        '                    </div>'+
        '                    <div class="col-md-6">'+
        '                        <div class="form-group">'+
        '                            <label>Complemento</label>'+
        '                            <input type="text" class="form-control" value="" name="complemento" id="complemento">'+
        '                        </div>'+
        '                    </div>'+
        '                    <div class="col-md-6">'+
        '                        <div class="form-group">'+
        '                            <label>Cidade</label>'+
        '                            <input type="text" class="form-control" value="" name="cidade" id="cidade">'+
        '                        </div>'+
        '                    </div>'+
        '                    <div class="col-md-6">'+
        '                        <div class="form-group">'+
        '                            <label>Estado</label>'+
        '                            <input type="text" class="form-control" value="" name="estado" id="estado">'+
        '                        </div>'+
        '                    </div>'+
        '                    <div class="card-wrapper"></div>'+
        '                </div>'+
        '            </div>'+
        '            <div>'+
        '                <button type="submit" class="btn btn-primary">Atualizar</button>'+
        '                <button type="cancel" onclick="alert('+ i +')" class="btn btn-light">Cancelar</button>'+
        '            </div>'+
        '        </form>'+
        '    </div>'+
        '</div>';

    retorno += novo;

    console.log(retorno);

    return retorno;
    
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
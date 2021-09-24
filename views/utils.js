plataformInit();
function goHome() {
    window.location.href = "Home.html";
}

function goDetail(id){
    window.location.href = "ProdutoDetalhe.html?produtoId="+id;
}

function goProfile(id){
    window.location.href = "Perfil.html?userId="+id;
}

function alertPadrao(){
    alert("utils")
}

function cancelRegister(){
    var result = confirm("Ao cancelar você perderá seu progresso. \nDeseja cancelar?")
    if (result){
        goHome();
    }
}

function register(){
    var username = document.getElementById("username").value;
    var nome = document.getElementById("nome").value;
    var sobrenome = document.getElementById("sobrenome").value;
    var email = document.getElementById("email").value;
    var telefone = document.getElementById("telefone").value;
    var cpf = document.getElementById("cpf").value;
    var nascimento = document.getElementById("nasimento").value;
    var bio = document.getElementById("bio").value;
    var senha = document.getElementById("senha").value;
    var confirmeSenha = document.getElementById("confirmeSenha").value;
    var zip = document.getElementById("cep").value;
    var rua = document.getElementById("rua").value;
    var bairro = document.getElementById("bairro").value;
    var numero = document.getElementById("numero").value;
    var complemento = document.getElementById("complemento").value;
    var cidade = document.getElementById("cidade").value;
    var estado = document.getElementById("estado").value;
    var cvv = document.getElementById("cvv").value;
    var validade = document.getElementById("validade").value;
    //var img = document.getElementById("img").value;

    if (senha != confirmeSenha){
        alert("as senhas inseridas devem ser iguais");
        return;
    }
    var nomeCompleto = nome + " " + sobrenome;

    var body = {
        username,
        nome: nomeCompleto,
        email,
        telefone,
        cpf,
        nascimento,
        bio,
        senha,
        zip,
        rua,
        bairro,
        numero,
        complemento,
        cidade,
        estado,
        cvv,
        validade

    }
    callApiPost('/user',  body, function(response){
        setUser(response.data);
        saveData("username", response.data.nome);
        saveData("userId", response.data.id);
        goHome();
    });
}

function login(){
    var username = document.getElementById("username").value;
    var senha = document.getElementById("senha").value;
    var body = {username, senha}
    callApiPost('/login', body, function(response){
        if (response.data.user.id){
            setUser(response.data.user);
            saveData("username", response.data.user.nome);
            saveData("userId", response.data.user.id);
            goHome();
        }
        else{
            alert("Usuário nao encontrado")
        }
        
    });
    return false;
}

function plataformInit(){
    var user = getUserLogado();
    if (!user){
        return;
    }
    var id = user.id;
    callApiGet('/user/'+id, function(response){
        if (response.data.user.id){
            setUser(response.data.user)
            if (!response.data.user.email_validado){
                enviarEmailValidacao();
            }
        }
        
    });
    return false;
}

function enviarEmailValidacao(){
    var user = getUserLogado();
    if (!user){
        return;
    }
    var id = user.id;
    var body = {id}
    callApiPost('/enviarEmailValidacao', body, function(response){
        let codigo = "";
        while(codigo.length < 3){
            codigo = prompt("Insira o código enviado para '"+user.email+"' de 'themarketlab0001@gmail.com'")
            if (codigo.length > 3) {
                let bodyCodigo = {id, codigo}
                callApiPost('/validarEmail', bodyCodigo, function(response){});
            }
        }
    });
    return false;
}

function logout(){
    saveData("username", "");
    saveData("userId", "");
    saveData("user", "");
    window.location.href = "Login.html";
    return false;
}

function saveData(key, value){
    //alert("salvando "+value+"como "+key)
    localStorage.setItem(key, value);
}

function setUser(user){
    //alert("salvando "+value+"como "+key)
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
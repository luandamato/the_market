
function carregarHome(){

    callApiGet('/produtos', function(response){
        addProducts(response.data.produtos);
    });

}

function addProducts(products){
    var containerProdutos = document.getElementById("produtos")
    if (products.length <1){
        containerProdutos.innerHTML += '<h1>Nenhum produto cadastrado</h1>'
        return;
    }
    products.map((val)=>{
        var usado = "";
        if (val.usado){
            usado = "Semi-novo"
        }
        var img = "./img/produto.png";
        if (val.imagem){
            img = val.imagem
        }
        containerProdutos.innerHTML += ''+
            '<div class="card" onclick="goDetail('+val.id+')">'+
			'<img class="img-produto" src="'+ img +'"/>'+
			'<span class="desconto">'+ usado +'</span>'+
			'<div class="panel">'+
				'<a href="#" class="fas fa-heart"></a>'+
				'<a href="#" class="fas fa-share"></a>'+
				'<a href="#" class="fas fa-search"></a>'+
			'</div>'+
			'<a href="#"><button>Adicionar ao carrinho</button></a>'+
			'<div class="info">'+
				'<h3>'+ val.nome +'</h3>'+
				'<div class="stars">'+
					'<i class="fas fa-star"></i>'+
					'<i class="fas fa-star"></i>'+
					'<i class="fas fa-star"></i>'+
					'<i class="fas fa-star"></i>'+
					'<i class="fas fa-star-half-alt"></i>'+
				'</div>'+
				'<strong class="preco"> R$ '+ val.preco +' </strong>'+
			'</div>'+
		'</div>';
    })
}

carregarHome()

function callApiGet(url, callback){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.onload = function(){
        if(xhr.status == 200){
            callback(JSON.parse(xhr.response));
        } else {
            //TODO: tratar os possíveis erros
            alert("ERRO: "+xhr.status);
        }
    }
    xhr.send();
}
var itens = [
    {
        id: '0',
        nome: 'camiseta',
        img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkL9dpnzYBMZcCDunEwKMnmPkQioUKOiisdg&usqp=CAU',
        quantidade: '0'
    },
    {
        id: '1',
        nome: 'short',
        img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROI274TIa55J22WFMfjpxGZILDIrk6zCXjvA&usqp=CAU',
        quantidade: '0'
    },
    {
        id: '2',
        nome: 'calça',
        img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzEN-KJSGJGCZw2yDluY5qmvITJ6_-XmZtWA&usqp=CAU',
        quantidade: '0'
    }
];

carregarHome = ()=>{
    var containerProdutos = document.getElementById("produtos")
    itens.map((val)=>{
        containerProdutos.innerHTML += '<div class="produto-single"> <img class="img-produto" src="'+val.img+'"/> <p>'+val.nome+'</p> <a id="addCarrinho" key="'+val.id+'"></a href="">Adicionar ao carrinho</a> </div>';
    })
}


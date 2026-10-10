
const produtos = [
    {
        nome: "Camiseta Essential",
        preco: 59.90,
        categoria: "Camisetas",
        imagem: "imagens/clasic.jpg"
    },
    {
        nome: "Camiseta Oversized",
        preco: 79.90,
        categoria: "Camisetas",
        imagem: "imagens/orvid.jpg"
    },
    {
        nome: "Calça Cargo Urban",
        preco: 129.90,
        categoria: "Calças",
        imagem: "imagens/calsa.jpg"
    },
    {
        nome: "Moletom Classic",
        preco: 149.90,
        categoria: "Moletons",
        imagem: "imagens/moleton.jpg"
    },
    {
        nome: "Boné Street",
        preco: 49.90,
        categoria: "Acessórios",
        imagem: "imagens/bone.jpg"
    },
    {
        nome: "Tênis Urban One",
        preco: 199.90,
        categoria: "Calçados",
        imagem: "imagens/tenis.jpg"
    }
];

const produtosSection = document.querySelector("#Produtos");
const carrinhoSection = document.querySelector("#Carrinho");

let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

function formatarPreco(preco) {
    return preco.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function salvarCarrinho() {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

function adicionar(produto) {
    const encontrado = carrinho.find(function(item) {
        return item.produto.nome === produto.nome;
    });

    if (encontrado) {
        encontrado.quantidade++;
    } else {
        carrinho.push({
            produto: produto,
            quantidade: 1
        });
    }

    salvarCarrinho();
    mostrarCarrinho();
}

function aumentarQuantidade(nome) {
    const encontrado = carrinho.find(function(item) {
        return item.produto.nome === nome;
    });

    if (encontrado) {
        encontrado.quantidade++;
    }

    salvarCarrinho();
    mostrarCarrinho();
}

function diminuirQuantidade(nome) {
    const encontrado = carrinho.find(function(item) {
        return item.produto.nome === nome;
    });

    if (encontrado) {
        encontrado.quantidade--;

        if (encontrado.quantidade <= 0) {
            carrinho = carrinho.filter(function(item) {
                return item.produto.nome !== nome;
            });
        }
    }

    salvarCarrinho();
    mostrarCarrinho();
}

function removerProduto(nome) {
    carrinho = carrinho.filter(function(item) {
        return item.produto.nome !== nome;
    });

    salvarCarrinho();
    mostrarCarrinho();
}

function mostrarCarrinho() {
    carrinhoSection.innerHTML = "";

    const titulo = document.createElement("h2");
    titulo.innerText = "🛒 Seu Carrinho";
    carrinhoSection.appendChild(titulo);

    if (carrinho.length === 0) {
        const mensagem = document.createElement("p");
        mensagem.innerText = "Seu carrinho está vazio.";
        carrinhoSection.appendChild(mensagem);
        return;
    }

    let totalItens = 0;
    let totalCompra = 0;

    carrinho.forEach(function(item) {
        const produto = item.produto;
        const quantidade = item.quantidade;

        totalItens += quantidade;
        totalCompra += produto.preco * quantidade;

        const card = document.createElement("div");

        const nome = document.createElement("p");
        nome.innerText = produto.nome;
        card.appendChild(nome);

        const preco = document.createElement("p");
        preco.innerText = "Preço: " + formatarPreco(produto.preco);
        card.appendChild(preco);

        const qtd = document.createElement("p");
        qtd.innerText = "Quantidade: " + quantidade;
        card.appendChild(qtd);

        const subtotal = document.createElement("p");
        subtotal.innerText =
            "Subtotal: " + formatarPreco(produto.preco * quantidade);
        card.appendChild(subtotal);

        const aumentar = document.createElement("button");
        aumentar.innerText = "+";
        aumentar.type = "button";
        aumentar.onclick = function() {
            aumentarQuantidade(produto.nome);
        };
        card.appendChild(aumentar);

        const diminuir = document.createElement("button");
        diminuir.innerText = "-";
        diminuir.type = "button";
        diminuir.onclick = function() {
            diminuirQuantidade(produto.nome);
        };
        card.appendChild(diminuir);

        const remover = document.createElement("button");
        remover.innerText = "Remover";
        remover.type = "button";
        remover.onclick = function() {
            removerProduto(produto.nome);
        };
        card.appendChild(remover);

        carrinhoSection.appendChild(card);
    });

    const quantidadeTotal = document.createElement("p");
    quantidadeTotal.innerText = "Total de itens: " + totalItens;
    carrinhoSection.appendChild(quantidadeTotal);

    const total = document.createElement("h3");
    total.innerText = "Total da compra: " + formatarPreco(totalCompra);
    carrinhoSection.appendChild(total);
    total.className = "total-carrinho";

    const finalizar = document.createElement("button");
    finalizar.type = "button";
    finalizar.innerText = "Finalizar pedido";
    finalizar.onclick = finalizarPedido;
    carrinhoSection.appendChild(finalizar);
}

function finalizarPedido() {
    if (carrinho.length === 0) {
        alert("Adicione algum produto antes de finalizar.");
        return;
    }

    let mensagem = "Olá! Gostaria de fazer este pedido:\n\n";
    let total = 0;

    carrinho.forEach(function(item) {
        const subtotal = item.produto.preco * item.quantidade;

        mensagem +=
            item.produto.nome +
            " | Quantidade: " + item.quantidade +
            " | Subtotal: " + formatarPreco(subtotal) +
            "\n";

        total += subtotal;
    });

    mensagem += "\nTotal: " + formatarPreco(total);

    const numero = "559492780733";
    const url =
        "https://wa.me/" + numero +
        "?text=" + encodeURIComponent(mensagem);

    window.open(url, "_blank");
}


function mostrarProdutos(categoria = "Todos") {
    produtosSection.innerHTML = "";

    const titulo = document.createElement("h2");
    titulo.innerText = categoria === "Todos"
        ? "Produtos"
        : categoria;

    produtosSection.appendChild(titulo);

    const produtosFiltrados = categoria === "Todos"
        ? produtos
        : produtos.filter(function(produto) {
            return produto.categoria === categoria;
        });

    produtosFiltrados.forEach(function(produto) {
        const card = document.createElement("div");
        card.className = "item-carrinho";

        const foto = document.createElement("img");
        foto.src = produto.imagem;
        foto.alt = produto.nome;
        card.appendChild(foto);

        const nome = document.createElement("p");
        nome.innerText = produto.nome;
        card.appendChild(nome);

        const preco = document.createElement("p");
        preco.innerText = formatarPreco(produto.preco);
        card.appendChild(preco);

        const botao = document.createElement("button");
        botao.type = "button";
        botao.innerText = "Adicionar ao carrinho";

        botao.onclick = function() {
            adicionar(produto);
        };

        card.appendChild(botao);
        produtosSection.appendChild(card);
    });
}

function filtrarCategoria(categoria) {
    mostrarProdutos(categoria);

    document.querySelector("#Produtos").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

mostrarProdutos();
mostrarCarrinho();
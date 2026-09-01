//localStorage.removeItem("itensSessao")
//localStorage.clear()

//criando o array de itens do carrinho
const itensCarrinho = JSON.parse(localStorage.getItem('itensSessao')) || []

//criando arrow item
const fObjItem = (objProduto) => {
    const item = {
        id_produto: objProduto.id_produto,
        descricao_produto: objProduto.descricao_produto,
        caminho_da_imagem: objProduto.caminho_da_imagem,
        valor_unitario: objProduto.valor_unitario,
        quantidade: 1
    }

    return item
}

//função para adicionar o item no array
const addItem = (objItem) => {
    //procurar se o item ja existe no carrinho
    const index = itensCarrinho.findIndex(elem => elem.id_produto === objItem.id_produto)

    if (index !== -1) {
        //se ja existe, aumenta a quantidade
        itensCarrinho[index].quantidade += 1
    } else {
        // se não existe adiciona
        itensCarrinho.push(fObjItem(objItem))
    }

    localStorage.setItem('itensSessao', JSON.stringify(itensCarrinho))
    renderCarrinho()
}

//listar itens do carrinho
const listItens = () => {
    return JSON.parse(localStorage.getItem('itensSessao')) || []
}

//remover elemento
const removeItem = (pos) => {
    itensCarrinho.splice(pos, 1)

    localStorage.setItem('itensSessao', JSON.stringify(itensCarrinho))
    renderCarrinho()
}

//função atualizar quantidade no carrinho
const atualizarQuantidade = (pos, quantidade) => {
    if (itensCarrinho[pos]) {
        // não deixa ficar com quantidade menor que 1
        itensCarrinho[pos].quantidade = quantidade > 0 ? quantidade : 1

        localStorage.setItem('itensSessao', JSON.stringify(itensCarrinho))
        renderCarrinho()
    }
}

//formata número para R$0,00
const formatarMoeda = (valor) => {
    return 'R$' + valor.toFixed(2).replace('.', ',')
}

//calcula e escreve os totais na tela
const calcularTotais = () => {
    let total = 0

    itensCarrinho.forEach(item => {
        total += item.valor_unitario * item.quantidade
    })

    const frete = itensCarrinho.length > 0 ? 10 : 0
    const totalPagar = total + frete

    document.getElementById('valor-total').textContent = formatarMoeda(total)
    document.getElementById('valor-frete').textContent = formatarMoeda(frete)
    document.getElementById('valor-pagar').textContent = formatarMoeda(totalPagar)
}

//monta o HTML de cada item do carrinho na tela
const renderCarrinho = () => {
    const container = document.getElementById('itens-carrinho')

    if (!container) return

    container.innerHTML = ''

    // se não há itens, mostra mensagem de carrinho vazio e para por aqui
    if (itensCarrinho.length === 0) {
        container.innerHTML = `
            <p id="carrinho-vazio">
                Seu carrinho está vazio. <a href="../index.html">Continue comprando</a>
            </p>
        `
        calcularTotais()
        return
    }

    itensCarrinho.forEach((item, pos) => {
        const totalItem = item.valor_unitario * item.quantidade

        const secao = document.createElement('section')
        secao.className = 'item'

        secao.innerHTML = `
            <img src="../${item.caminho_da_imagem}" alt="${item.descricao_produto}" class="img-item">
            <p class="descricao"> ${item.descricao_produto} </p>
            <p class="vlr-unitario"> ${formatarMoeda(item.valor_unitario)} </p>
            <input type="number" name="quant${pos}" class="input-item" min="1" value="${item.quantidade}">
            <p class="tot-item"> ${formatarMoeda(totalItem)} </p>
            <img src="../icones/remover.png" alt="" class="img-remover">
        `

        //quando mudar a quantidade, atualiza esse item e os totais
        const inputQuantidade = secao.querySelector('.input-item')
        inputQuantidade.addEventListener('input', (e) => {
            const novaQuantidade = parseInt(e.target.value)
            atualizarQuantidade(pos, novaQuantidade)
        })

        //botão de remover item
        const btnRemover = secao.querySelector('.img-remover')
        btnRemover.addEventListener('click', () => {
            removeItem(pos)
        })

        container.appendChild(secao)
    })

    calcularTotais()
}

//inicia o carrinho assim que a página carrega
document.addEventListener('DOMContentLoaded', renderCarrinho)

export { addItem, listItens, removeItem, atualizarQuantidade }

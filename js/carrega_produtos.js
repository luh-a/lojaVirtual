//importando o array dos produtos
import { produtos } from "./produtos.js";

//importando a arrow function addItem
import { addItem } from "./carrinho.js";

//pegando elementos do dom
const section_cards = document.querySelector('#cards')

//carrega
const carregaProdutos = (id_secao) => {
    //ao chamar a função carregaProdutos() deve passar o parâmetro. 0(zero) chama a função listarProdutos(), qualquer outro valor chama a função produtosFiltrados(id_secao)
    if(id_secao === 0) {
        montandoCards(listaProdutos())
    } else {
        montandoCards(produtosFiltrados(id_secao))
    }

    //qualquer função chama sempre a função montarSecoes()
    montarSecoes()
}

//função para carregar os produtos
const listaProdutos = () => {
    return produtos
}

//Filtra as seções com a coleção map
const listarSecoes = () => {
    //criando a coleção map
    const secoesFiltrada = new Map()

    //percorrendo o array produtos e filtrando as seções
    produtos.forEach((elem, i)=>{
        //criando a chave e o valor da coleção map a partir do id da seção da lista de produtos
        secoesFiltrada.set(elem.id_secao, elem)
    })

    //convertendo o map em array
    const secoesMenu = Array.from(secoesFiltrada.values())

    //retornando o array convertido
    return secoesMenu

}

//montando os links seções
const montarSecoes = () => {
    //pegando o elemento do dom
    const ulMenu = document.querySelector('#menu_secoes')
    //limpando o elemento ulMenu
    ulMenu.innerHTML = ''

    //criando o link todo
    //criando o elemento li
    const liSecao = document.createElement('li')
    liSecao.setAttribute('class', 'right left')  

    //criando o elemento a
    const aSecao = document.createElement('a')
    aSecao.setAttribute('href', '#')
    aSecao.setAttribute('class', 'lnk_secao')
    aSecao.innerHTML = 'Todos'

    //capturando o click dos links
    aSecao.addEventListener('click', () => {
        //chamando função produtos filtrados
        carregaProdutos(0)
    })

    //adicionando o elemento filho a no elemento li
    liSecao.appendChild(aSecao)

    //adicionando o elemento filho li no elemento do dom ul
    ulMenu.appendChild(liSecao)

    //percorrendo o array das seções filtradas
    listarSecoes().forEach((elem, i) => {
        //criando o elemento li
        const liSecao = document.createElement('li')
        liSecao.setAttribute('class', 'right')  

        //criando o elemento a
        const aSecao = document.createElement('a')
        aSecao.setAttribute('href', '#')
        aSecao.setAttribute('class', 'lnk_secao')
        aSecao.innerHTML = elem.nome_secao

        //capturando o click dos links
        aSecao.addEventListener('click', () => {
            //chamando função produtos filtrados
            montandoCards(produtosFiltrados(elem.id_secao))
        })

        //adicionando o elemento filho a no elemento li
        liSecao.appendChild(aSecao)

        //adicionando o elemento filho li no elemento do dom ul
        ulMenu.appendChild(liSecao)
    })

}

//filtrando produtos
const produtosFiltrados = (idSecao) => {
    return produtos.filter(elem => elem.id_secao === idSecao)
}

//filtrando pelo input
//pegando o input no dom
const inputPesquisa = document.querySelector('#pesquisa')

//capturando o evento input
inputPesquisa.addEventListener('input', (evt) => {
    //capturando o texto do input e o deixando-o em minúsculo na variável txtInput
    let txtInput = evt.target.value.toLowerCase()

    //filtra os dados montando os cards pelo filter e includes
    montandoCards(produtos.filter(elem => elem.descricao_produto.toLowerCase().includes(txtInput)))
})

//montando cards
const montandoCards = (objProdutos) =>{
    section_cards.innerHTML = ''

    objProdutos.forEach((elem, i) =>{
        const divCard = document.createElement('div')
        divCard.setAttribute('class', 'card')

        const imgProduto = document.createElement('img')
        imgProduto.setAttribute('src', elem.caminho_da_imagem)
        imgProduto.setAttribute('alt', elem.descricao_produto)
        imgProduto.setAttribute('clas', 'img_card')

        const h2Título =  document.createElement('h2')
        h2Título.innerHTML = elem.descricao_produto

        const h3Valor = document.createElement('h3')
        h3Valor.setAttribute('class', 'valor_card')
        h3Valor.innerHTML = `R$ ${parseFloat(elem.valor_unitario).toFixed(2).replace('.',',')}`

        const btn_card = document.createElement('button')
        btn_card.setAttribute('class', 'btn_card')
        btn_card.innerHTML = 'Adicionar'

        btn_card.addEventListener('click', () => {
            //adicionado um objeto no carrinho
            addItem(elem)

            //redireciona para a página carrinho.html
            window.location.href = "../paginas/carrinho.html"
        })

        divCard.appendChild(imgProduto)
        divCard.appendChild(h2Título)
        divCard.appendChild(h3Valor)
        divCard.appendChild(btn_card)

        section_cards.appendChild(divCard)

    })
}

carregaProdutos(0)

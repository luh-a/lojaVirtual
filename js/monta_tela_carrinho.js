import { listItens, removeItem, atualizarQuantidade } from './carrinho.js'; // Ajuste o caminho se necessário

// Seletores dos elementos da tela
const containerItens = document.getElementById('itens-carrinho');
const elementoValorTotal = document.getElementById('valor-total');
const elementoValorFrete = document.getElementById('valor-frete');
const elementoValorPagar = document.getElementById('valor-pagar');

// Função auxiliar para formatar em Reais (R$)
const formatarMoeda = (valor) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

// Função para calcular os totais e atualizar o HTML
const calcularTotais = () => {
    const itens = listItens();
    let totalProdutos = 0;

    itens.forEach(item => {
        totalProdutos += item.valor_unitario * item.quantidade;
    });

    // Exemplo de frete fixo de R$ 10,00 se houver itens
    const valorFrete = itens.length > 0 ? 10.00 : 0.00;
    const totalPagar = totalProdutos + valorFrete;

    elementoValorTotal.textContent = formatarMoeda(totalProdutos);
    elementoValorFrete.textContent = formatarMoeda(valorFrete);
    elementoValorPagar.textContent = formatarMoeda(totalPagar);
};

// Função para desenhar os itens na tela dinamicamente
const renderizarCarrinho = () => {
    const itens = listItens();
    containerItens.innerHTML = ''; // Limpa os itens estáticos do HTML original

    if (itens.length === 0) {
        containerItens.innerHTML = '<p style="padding: 20px; text-align: center;">O seu carrinho está vazio.</p>';
        calcularTotais();
        return;
    }

    itens.forEach((item, index) => {
        const totalItem = item.valor_unitario * item.quantidade;

        const sectionItem = document.createElement('section');
        sectionItem.classList.add('item');

        sectionItem.innerHTML = `
            <img src="${item.caminho_da_imagem}" alt="${item.descricao_produto}" class="img-item">
            <p class="descricao">${item.descricao_produto}</p>
            <p class="vlr-unitario">${formatarMoeda(item.valor_unitario)}</p>
            <input type="number" min="1" name="quant${index}" class="input-item" value="${item.quantidade}" data-index="${index}">
            <p class="tot-item">${formatarMoeda(totalItem)}</p>
            <img src="../icones/remover.png" alt="Remover" class="img-remover" data-index="${index}">
        `;

        containerItens.appendChild(sectionItem);
    });

    calcularTotais();
    vincularEventos();
};

// Função para adicionar os escutadores de eventos nos inputs e botões criados dinamicamente
const vincularEventos = () => {
    // Monitora a mudança de quantidade nos inputs
    const inputsQuantidade = document.querySelectorAll('.input-item');
    inputsQuantidade.forEach(input => {
        input.addEventListener('change', (e) => {
            const index = e.target.getAttribute('data-index');
            let novaQuantidade = parseInt(e.target.value);

            // Garante que a quantidade mínima seja 1
            if (isNaN(novaQuantidade) || novaQuantidade < 1) {
                novaQuantidade = 1;
                e.target.value = 1;
            }

            // Atualiza no localStorage através da função do Carrinho.js
            atualizarQuantidade(index, novaQuantidade);

            // Atualiza a tela novamente para recalcular os valores linha a linha e o total geral
            renderizarCarrinho();
        });
    });

    // Monitora o clique no botão de remover item
    const botoesRemover = document.querySelectorAll('.img-remover');
    botoesRemover.forEach(botao => {
        botao.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            removeItem(index);
            renderizarCarrinho();
        });
    });
};

// Executa assim que a página carregar
document.addEventListener('DOMContentLoaded', () => {
    renderizarCarrinho();
});
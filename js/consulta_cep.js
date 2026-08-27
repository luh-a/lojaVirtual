//pegando o input cep do dom
const inputCep = document.querySelector('#cep')
const formPessoa = document.querySelector('#form-pessoa')

//capturando o evento ao perder o foco
inputCep.addEventListener('change', (evt) => {
    //pegando os números do input não permitindo outro tipo de dados que não seja dígito
    const numCep = evt.target.value.replace(/\D/g, "")

    //verifica se são 8 dígitos
    if (numCep.length != 8) {
        alert('CEP inválido!')
        return
    }

    //chama a função buscandoDadosCep
    buscandoDadosCep(numCep)

})

//await = esperar resposta
//async = não para o processo enquanto a consulta é feita
//fetch = nativo do java

//buscar os dados do ceps
const buscandoDadosCep = async (cep) => {
    //tenta buscar os dados do viacep
    try {
        //busca os dados no viacep
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)

        //converte os dados no formato json
        const dadosEndereco = await response.json()

        exibeDados(dadosEndereco)

        //caso aja algum erro é capturado pelo catch
    } catch (erro) {
        console.log(erro.message)
    }

}

//objeto literal campos cada chave representa um input do dom
const campos = {
    logradouro: document.querySelector('#logradouro'),
    bairro: document.querySelector('#bairro'),
    localidade: document.querySelector('#localidade'),
    uf: document.querySelector('#uf')
}

//função exibe dados
const exibeDados = (objDados) => {
    //pega a div pai dos elementos do endereço
    const divEndereco = document.querySelector('#div-dados-endereco')
    //remove da div o class oculto
    divEndereco.classList.remove('oculto')

    //percorre o objeto, no formato json, do via cep
    for(let chave in campos){
        //atribui o valor ao input
        campos[chave].value = objDados[chave]

        //bloqueia os inputs, não permite que o usuário apague os valores
        campos[chave].disabled = true
    }

    document.querySelector('#num-residencia').focus()

}

formPessoa.addEventListener('reset', () => {
    //pega a div pai dos elementos do endereço
    const divEndereco = document.querySelector('#div-dados-endereco')

    //remove da div o class oculto
    divEndereco.classList.add('oculto')
})
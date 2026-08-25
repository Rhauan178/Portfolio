// Pega os elementos e adiciona a animação do sonic ao clicar na imagem do anel
document.getElementById("anel").addEventListener("click", function() {
    var sonic = document.getElementById("sonic");
    sonic.classList.add("animar");
});
// parte do código feita para obervar os elementos que estão "escondidos", para ao estarem visíveis ao usuário ganharem a classe show e acontecer o efeito de blur
const myObserver = new IntersectionObserver((entries) =>{
    entries.forEach( (entry) => {
        //adiciona a classe 'show' ao ser "visto" pelo usuário
        if(entry.isIntersecting){
            entry.target.classList.add('show')
        } else{ //remove a classe 'show' ao deixar de ser "visto" pelo usuário
            entry.target.classList.remove('show')
        }
    })
} )
// selecionar todos com a classe .hidden e aramazena na NodeList(coleção de nós, ou melhor dizendo algo parecido com um array(variável))
const elements = document.querySelectorAll('.hidden')
//itera sobre os elementos armazenas na NodeList
elements.forEach(element => myObserver.observe(element))
//ele basicamente observa mudanças quanto aos elementos

function openNav(){
    document.getElementById("Nav").style.display = "block"
    document.getElementById("open_button").style.display = 'none'
    document.getElementById("add_button").style.right = "400px";
    document.getElementById("inserir_nota").style.right = "330px";

    /*document.getElementById("Nav").style.display = "block"
    document.getElementById("Nav").style.width = '250px';
    document.getElementById("Nav").style.padding = '30px';
    document.getElementById("open_button").style.display = 'none';
    document.getElementById("list").style.display = "block";
    document.getElementById("bottom_navbar").style.position = "fixed"
    document.getElementById("add_button").style.right = "400px";
    document.getElementById("inserir_nota").style.right = "330px";*/

}

function closeNav(){

    document.getElementById("Nav").style.display = "none"
    document.getElementById("open_button").style.display = 'block'
    
    document.getElementById("add_button").style.right = "275px";
    document.getElementById("inserir_nota").style.right = "80px";
    
    /*document.getElementById("Nav").style.width = '0%';
    document.getElementById("Nav").style.padding = '0px';
    document.getElementById("Nav").style.display = "none"
    document.getElementById("open_button").style.display = 'block';
    document.getElementById("list").style.display = "none";
    document.getElementById("add_button").style.right = "300px";
    document.getElementById("inserir_nota").style.right = "80px";*/
}

function addNote(){
    document.getElementById("inserir_nota").style.display = "block";
}

function closeNota(){
    document.getElementById("inserir_nota").style.display = "none";
}

// Deslogar usuário
var deslogar = document.getElementById("sair");

deslogar.addEventListener("click", function(event){

    event.preventDefault(); // evita recarregar a página

    // Remove usuário logado do localStorage
    localStorage.removeItem("usuario_logado");

    // Redireciona para login
    window.location.href = "login.html";

});

////////////////////////////////////////////////
function Salvar(){
    document.getElementById("inserir_nota").style.display = "none";
    
    var titulo = document.getElementById("title").value;
    var conteudo = document.getElementById("paragrafo").value;

    if (conteudo !== "") {
        // Recupera usuário logado
        var usuario_logado = JSON.parse(localStorage.getItem("usuario_logado"));
        if (!usuario_logado) {
            alert("Nenhum usuário logado. Faça login novamente.");
            return;
        }

        // Recupera TODAS as notas já salvas
        var notas = JSON.parse(localStorage.getItem("notas")) || {};

        // Sempre cria espaço para o usuário atual (visitante ou não)
        if (!notas[usuario_logado.email]) {
            notas[usuario_logado.email] = [];
        }

        // Criar objeto da nova nota
        var novaNota = {
            titulo: titulo || "Sem título",
            conteudo: conteudo
        };

        // Adicionar no array do usuário
        notas[usuario_logado.email].push(novaNota);

        // Salvar de volta no localStorage
        localStorage.setItem("notas", JSON.stringify(notas));

        // Mostrar na tela
        mostrarNota(novaNota);
    }

    // Limpar os inputs
    document.getElementById("title").value = "";
    document.getElementById("paragrafo").value = "";
}

function mostrarNota(nota){
    const box = document.createElement('div');
    box.classList.add('box');
    box.innerHTML = `
        <div class="titulo"><h2>${nota.titulo}</h2></div>
        <div class="conteudo">
            <p class="conteudo_editavel">${nota.conteudo}</p>
        </div>
    `;
    document.getElementById("main").appendChild(box);
}

window.onload = function(){
    var usuario_logado = JSON.parse(localStorage.getItem("usuario_logado"));

    if (!usuario_logado) {
        window.location.href = "login.html";
        return;
    }

    var notas = JSON.parse(localStorage.getItem("notas")) || {};

    // garante que sempre exista o array do usuário atual
    if (!notas[usuario_logado.email]) {
        notas[usuario_logado.email] = [];
        localStorage.setItem("notas", JSON.stringify(notas));
    }

    // Mostrar cada nota desse usuário
    notas[usuario_logado.email].forEach(nota => {
        mostrarNota(nota);
    });
};
//////////////////////////////////////////////////////

function editarNota() {
    document.getElementById("editar_conteudo").style.display = "block";

    var titulo = document.getElementById("title").value;
    var conteudo = document.getElementById("conteudo_editavel").innerText;



    alert(conteudo)
    document.getElementById("paragrafo").value = conteudo;
    
}

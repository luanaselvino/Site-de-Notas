// REVISAR: Salvar, deslogar, mostrarNota(), onload.

// Fechar editor de notas
document.getElementById("close_nota").addEventListener("click", function() {
    document.getElementById("inserir_nota").style.display = "none";
});

// Salvar notas criadas com localStorage
document.getElementById("salvar").addEventListener("click", function() {
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
});

// Abrir div="inserir_nota"
document.getElementById("add_button").addEventListener("click", function() {
    document.getElementById("inserir_nota").style.display = "block";
});

// Abrir nav
document.getElementById("open_nav").addEventListener("click", function() {
    document.getElementById("Nav").style.display = "flex";
    document.getElementById("open_nav").style.display = 'none';
    document.getElementById("add_button").style.right = "27vw";
    document.getElementById("inserir_nota").style.right = "330px";
});

// Fechar nav
document.getElementById("close_nav").addEventListener("click", function() {
    document.getElementById("Nav").style.display = "none"
    document.getElementById("open_nav").style.display = 'flex'
    document.getElementById("add_button").style.right = "20vw";
    document.getElementById("inserir_nota").style.right = "80px";
});

////////////////////////////////////////////////

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

function mostrarNota(nota){
    const box = document.createElement('div');
    box.classList.add('box');
    box.innerHTML = `
        <div class="titulo">${nota.titulo}</div>
        <div class="conteudo">${nota.conteudo}</div>
    `;
    document.getElementById("main").appendChild(box);
}

////////////////////////////////////////////////

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
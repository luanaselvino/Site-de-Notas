function openNav(){
    document.getElementById("Nav").style.width = '250px';
    document.getElementById("Nav").style.padding = '30px';
    document.getElementById("open_button").style.display = 'none';
    document.getElementById("list").style.display = "block";
    document.getElementById("bottom_navbar").style.position = "fixed"
    document.getElementById("add_button").style.right = "400px";
    document.getElementById("inserir_nota").style.right = "330px";
}

function closeNav(){
    document.getElementById("Nav").style.width = '0%';
    document.getElementById("Nav").style.padding = '0px';
    document.getElementById("open_button").style.display = 'block';
    document.getElementById("list").style.display = "none";
    document.getElementById("add_button").style.right = "300px";
    document.getElementById("inserir_nota").style.right = "80px";
}

function addNote(){
    document.getElementById("inserir_nota").style.display = "block";
}

function closeNota(){
    document.getElementById("inserir_nota").style.display = "none";
}

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

        // Se o usuário ainda não tem notas, cria um array vazio
        if (!notas[usuario_logado.email]) {
            notas[usuario_logado.email] = [];
        }

        // Criar objeto da nova nota
        var novaNota = {
            titulo: titulo,
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
        <div class="titulo"><h1>${nota.titulo}</h1></div>
        <div class="conteudo">
            <p class="conteudo_editavel">${nota.conteudo}</p>
        </div>
    `;
    document.getElementById("main").appendChild(box);
}

window.onload = function(){
    var usuario_logado = JSON.parse(localStorage.getItem("usuario_logado"));
    //if (!usuario_logado) {
        // Se não tem usuário logado → volta pro login
        //window.location.href = "login.html";
        //return;
    //}

    // Pegar notas do localStorage
    var notas = JSON.parse(localStorage.getItem("notas")) || {};
    var notasUsuario = notas[usuario_logado.email] || [];

    // Mostrar cada nota desse usuário
    notasUsuario.forEach(nota => {
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

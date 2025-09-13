// Fechar editor de notas
document.getElementById("close_nota").addEventListener("click", function() {
    document.getElementById("inserir_nota").style.display = "none";

    // Limpar os inputs
    document.getElementById("titulo").value = "";
    document.getElementById("conteudo").value = "";
});

// Salvar notas criadas com localStorage
document.getElementById("salvar").addEventListener("click", function() {
    document.getElementById("inserir_nota").style.display = "none";
    
    var titulo = document.getElementById("titulo").value;
    var conteudo = document.getElementById("conteudo").value;

    if (conteudo !== "") {
        // Recupera usuário logado
        // JSON.parse() transforma a informação que estava como texto de volta em objeto de JS
        var usuario_logado = JSON.parse(localStorage.getItem ("usuario_logado"));

        // Recupera TODAS as notas já salvas ou cria um objeto vazio {}
        var notas = JSON.parse(localStorage.getItem("notas")) || {};

        // Verifica se o usuário ainda não tem uma lista de notas
        //Se não tiver, cria uma lista vazia
        if (!notas[usuario_logado.email]) {
            notas[usuario_logado.email] = [];
        }

        // Criar objeto da nova nota
        var novaNota = {
            id: Date.now(),  // cria um id único
            titulo: titulo || "Sem título",
            conteudo: conteudo
        };

        // Pegamos a lista de notas do usuário atual (notas[usuario_logado.email]) e colocamos a nova nota dentro dela.
        notas[usuario_logado.email].push(novaNota);

        // Salvar de volta no localStorage
        localStorage.setItem("notas", JSON.stringify(notas));

        // Mostrar na tela // Chamar função mostrarNota()
        mostrarNota(novaNota);
    }

    // Limpar os inputs
    document.getElementById("titulo").value = "";
    document.getElementById("conteudo").value = "";
});

function mostrarNota(nota){
    const box = document.createElement('div');
    box.classList.add('box');
    box.innerHTML = `
        <div class="titulo">${nota.titulo}</div>
        <div class="conteudo">${nota.conteudo}</div>

        <div class="editor">
            <button class="excluir_nota">
                <i class="fa-solid fa-eraser"></i>
            </button>

            <button class="editar_nota">
                <i class="fa-solid fa-pen-to-square"></i>
            </button>
        </div>
    `;

    // Apagar notas //
    // adiciona evento em cada um
    var excluir_nota = box.querySelector(".excluir_nota");
    excluir_nota.addEventListener("click", function() {
        
        var usuario_logado = JSON.parse(localStorage.getItem("usuario_logado"));
        var notas = JSON.parse(localStorage.getItem("notas")) || {};

        // Filtra a nota clicada
        // notas[usuario_logado.email] → é a lista de todas as notas do usuário
        // .filter é uma função de array que cria um novo array com apenas os itens que passam no teste, cada item da lista (n) será testado
        // => indica uma função curta que retorna true ou false
        // Se retornar true, a nota fica na lista. Se retornar false, a nota é removida.
        // verifica se a nota atual n é exatamente igual à nota que queremos apagar
        // só mantém na lista as notas que NÃO são iguais à nota clicada
        notas[usuario_logado.email] = notas[usuario_logado.email].filter(n => 
            !(n.titulo === nota.titulo && n.conteudo === nota.conteudo)
        );

        // salva de volta no localStorage
        localStorage.setItem("notas", JSON.stringify(notas));
        
        box.remove(); // remove da tela
    });

    document.getElementById("main").appendChild(box);
}

// Abrir div="inserir_nota"
document.getElementById("add_button").addEventListener("click", function() {
    document.getElementById("inserir_nota").style.display = "block";
});
    
// Editar notas

// Abrir nav
document.getElementById("open_nav").addEventListener("click", function() {
    document.getElementById("Nav").style.display = "flex";
    document.getElementById("open_nav").style.display = 'none';
    document.getElementById("add_button").style.right = "23vw";
    document.getElementById("inserir_nota").style.right = "330px";
});

// Fechar nav
document.getElementById("close_nav").addEventListener("click", function() {
    document.getElementById("Nav").style.display = "none"
    document.getElementById("open_nav").style.display = 'flex'
    document.getElementById("add_button").style.right = "20vw";
    document.getElementById("inserir_nota").style.right = "80px";
});

// Deslogar usuário
var deslogar = document.getElementById("sair");

deslogar.addEventListener("click", function(event){

    event.preventDefault(); // evita recarregar a página

    // Remove usuário logado do localStorage
    localStorage.removeItem("usuario_logado");

    // Redireciona para login
    window.location.href = "login.html";

});

// window.onload = function(){}; a função só é executada quando a página termina de carregar
window.onload = function() {

    var usuario_logado = JSON.parse(localStorage.getItem("usuario_logado"));
    if (!usuario_logado) {
        // Se não tem usuário logado → volta pro login
        window.location.href = "login.html";
        return;
    }

    var notas = JSON.parse(localStorage.getItem("notas")) || {};

    if (!notas[usuario_logado.email]) {
        notas[usuario_logado.email] = [];
        localStorage.setItem("notas", JSON.stringify(notas));
    }

    // Flag para verificar se é o primeiro acesso
    var primeiroAcesso = localStorage.getItem("primeiroAcesso_" + usuario_logado.email);

    if (!primeiroAcesso) {
        // Cria nota inicial
        var notaInicial = {
            id: Date.now(),  // id único
            titulo: "Bem-vindo(a)!",
            conteudo: "Esta é sua primeira nota. Você pode editá-la ou apagar quando quiser."
        }

        // Adiciona ao storage
        notas[usuario_logado.email].push(notaInicial);
        localStorage.setItem("notas", JSON.stringify(notas));

        // Marca que já teve o primeiro acesso
        localStorage.setItem("primeiroAcesso_" + usuario_logado.email, "true");
    }

    // Pega todas as notas do usuário logado
    // Para cada nota chama a função mostrarNota()
    notas[usuario_logado.email].forEach(nota => {
        mostrarNota(nota);
    });
};
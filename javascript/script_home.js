let usuarioLogado = null;
let grupoLogado = null;

// window.onload = function(){}; a função só é executada quando a página termina de carregar
window.onload =  async function() {
    usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
    grupoLogado = JSON.parse(localStorage.getItem("grupoLogado"));

    var nome_usuario = document.getElementById("nome_usuario");
    var tipo_perfil = document.getElementById("tipo_perfil");

    if (!grupoLogado || !usuarioLogado) {
        window.location.href = "index.html";
        return;
    }

    try {
        // Busca na API DE NOTAS todas as notas onde a coluna 'UserID' bate com o Id do usuário logado
        const response = await fetch(`${SHEETDB_API.NOTAS}/search?GrupoID=${grupoLogado.GrupoID}`);
        const notasDoUsuario = await response.json(); // A resposta é a lista de notas
        
        // Mostra cada nota encontrada na tela
        if (notasDoUsuario.length > 0) {
            notasDoUsuario.forEach(nota => {
                mostrarNota(nota);
            });
        }

        nome_usuario.textContent = `${usuarioLogado.Nome} (ativo)`;
        tipo_perfil.textContent = usuarioLogado.Perfil;

    } catch (error) {
        console.error("Erro ao buscar notas do usuário:", error);
    }
};

// Salvar notas criadas (SHEETDB)
let notaEmEdicao = null; // Guarda a nota sendo editada
document.getElementById("salvar").addEventListener("click", async function() {
    document.getElementById("inserir_nota").style.display = "none";
    
    var titulo = document.getElementById("titulo").value.trim();
    var conteudo = document.getElementById("conteudo").value.trim();

    if (!conteudo) return alert("O conteúdo da nota não pode estar vazio.");

    const salvarBtn = document.getElementById("salvar");

    try {
        // Edição de notas
        if (notaEmEdicao) {
            await fetch(`${SHEETDB_API.NOTAS}/NotasID/${notaEmEdicao.NotasID}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    data: { Titulo: titulo, Conteudo: conteudo }
                })
            });

            // Atualiza na tela
            const box = document.querySelector(`[data-id='${notaEmEdicao.NotasID}']`);
            if (box) {
                box.querySelector(".titulo").textContent = titulo;
                box.querySelector(".conteudo").textContent = conteudo;
            }

            notaEmEdicao = null;
        }

        // Criar nova nota
        else {
            const novaNota = {
                NotasID: Date.now(),
                UserID: usuarioLogado.UserID,
                Nome: usuarioLogado.Nome,
                Titulo: titulo || "Sem título",
                Conteudo: conteudo,
                GrupoID: grupoLogado.GrupoID
            };

            await fetch(SHEETDB_API.NOTAS, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ data: [novaNota] })
            });

            mostrarNota(novaNota);
        }

        document.getElementById("titulo").value = "";
        document.getElementById("conteudo").value = "";
        document.getElementById("inserir_nota").style.display = "none";

    } catch (error) {
        console.error("Erro ao salvar ou atualizar nota:", error);
        alert("Não foi possível salvar/atualizar a nota.");
    }
});

function mostrarNota(nota){
    var box = document.createElement('div');
    box.classList.add('box');
    box.setAttribute('data-id', nota.NotasID);
    box.innerHTML = `
        <div class="titulo">${nota.Titulo}</div>
        <div class="conteudo">${nota.Conteudo}</div>
        
        <div class="editor">
            <span class="autor">${nota.Nome}</span>
            <div class="acoes">
                <button class="excluir_nota"> <i class="fa-solid fa-eraser"></i> </button>
                <button class="editar_nota"> <i class="fa-solid fa-pen-to-square"></i> </button>
            </div>
        </div>
    `;

    var excluir_nota = box.querySelector(".excluir_nota");
    excluir_nota.addEventListener("click", async function() {
        if (!confirm("Tem certeza que deseja apagar esta nota?")) {
            return;
        }
        try {
            // Usa a API DE NOTAS para apagar (DELETE) a linha com o ID específico da nota
            await fetch(`${SHEETDB_API.NOTAS}/NotasID/${nota.NotasID}`, {
                method: 'DELETE'
            });
            
            // Remove a nota da tela.
            box.remove();

        } catch (error) {
            console.error("Erro ao excluir a nota:", error);
            alert("Não foi possível excluir a nota. Tente novamente.");
        }
    });

    var editar_nota = box.querySelector(".editar_nota");
    editar_nota.addEventListener("click", function() {
        // Ativa o modo de edição
        notaEmEdicao = nota;
        // Mostra o editor com dados da nota
        document.getElementById("inserir_nota").style.display = "block";
        document.getElementById("titulo").value = nota.Titulo;
        document.getElementById("conteudo").value = nota.Conteudo;
    });

    document.getElementById("main").appendChild(box);
}

// Pesquisar notas criadas
var campoPesquisa = document.getElementById("pesquisa");
campoPesquisa.addEventListener("input", function () {
    var termo = this.value.toLowerCase(); // texto digitado
    var notas = document.querySelectorAll(".box"); // cada nota

    notas.forEach(nota => {
        var titulo = nota.querySelector(".titulo").textContent.toLowerCase();
        var conteudo = nota.querySelector(".conteudo").textContent.toLowerCase();

        // Mostra apenas notas que contêm o termo no título ou conteúdo
        if (titulo.includes(termo) || conteudo.includes(termo)) {
            nota.style.display = "block";
        } else {
            nota.style.display = "none";
        }
    });
});

// NAVEGAÇÃO //
// Fechar editor de notas
document.getElementById("close_nota").addEventListener("click", function() {
    document.getElementById("inserir_nota").style.display = "none";

    // Limpar os inputs
    document.getElementById("titulo").value = "";
    document.getElementById("conteudo").value = "";
});

// Abrir div="inserir_nota"
document.getElementById("add_button").addEventListener("click", function() {
    document.getElementById("inserir_nota").style.display = "block";
});

// Abrir nav
document.getElementById("open_nav").addEventListener("click", function() {
    document.getElementById("Nav").style.display = "flex";
    document.getElementById("open_nav").style.display = 'none';
});

// Fechar nav
document.getElementById("close_nav").addEventListener("click", function() {
    document.getElementById("Nav").style.display = "none"
    document.getElementById("open_nav").style.display = 'flex'
});

// Deslogar usuário
var deslogar = document.getElementById("sair");

deslogar.addEventListener("click", function(event){

    event.preventDefault(); // evita recarregar a página

    // Remove usuário logado do 
    localStorage.removeItem("usuarioLogado");
    localStorage.removeItem("grupoLogado");

    // Redireciona para login
    window.location.href = "index.html";

});
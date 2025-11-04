let usuarioLogado = null;
let grupoLogado = null;
let allGroupNotes = [];

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
        const notasDoGrupo = await response.json(); // A resposta é a lista de notas
        allGroupNotes = notasDoGrupo;
        
        // Mostra cada nota encontrada na tela
        if (allGroupNotes.length > 0) {
            allGroupNotes.forEach(nota => {
                mostrarNota(nota);
            });
        }

        updateFiltroUsuarios();

        nome_usuario.textContent = `${usuarioLogado.Nome} - Painel`;
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

            // Atualiza no array
            const index = allGroupNotes.findIndex(n => n.NotasID === notaEmEdicao.NotasID);
            if (index !== -1) {
                allGroupNotes[index].Titulo = titulo;
                allGroupNotes[index].Conteudo = conteudo;
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
            allGroupNotes.push(novaNota);
            updateFiltroUsuarios();
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

    const cores = ['#ffaa89', '#b5cc9a', '#ffe49a', '#c8e9ff', '#d2d1ff', '#ffffffff'];
    const corAleatoria = cores[Math.floor(Math.random() * cores.length)];
    box.style.backgroundColor = corAleatoria;

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
            
            box.remove(); // Remove a nota da tela
            allGroupNotes = allGroupNotes.filter(n => n.NotasID !== nota.NotasID);
            updateFiltroUsuarios();

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

filtrar = document.getElementById("filtrar");
filtrar_usuarios = document.getElementById("filtrar_usuarios");
filtrar.addEventListener("click", function() {
    if (filtrar_usuarios.style.display === "block") {
        filtrar_usuarios.style.display = "none";
    } else {
        filtrar_usuarios.style.display = "block";
    }
})

// Filtrar usuários
function updateFiltroUsuarios() {
    const filtroContainer = document.getElementById("filtrar_usuarios");
    filtroContainer.innerHTML = ''; // Limpa a lista antiga

    // Adiciona um botão "Mostrar Todos"
    const pTodos = document.createElement("p");
    pTodos.textContent = "Mostrar Todos";
    pTodos.style.cursor = "pointer"; // Faz parecer clicável
    pTodos.addEventListener('click', () => {
        const notas = document.querySelectorAll(".box");
        notas.forEach(nota => {
            nota.style.display = "block";
        });
    });
    filtroContainer.appendChild(pTodos);

    // Pega todos os nomes do array de notas
    const autores = allGroupNotes.map(nota => nota.Nome);
    
    // Filtra para ter apenas nomes únicos
    const autoresUnicos = [...new Set(autores)];

    // Cria um <p> para cada autor único
    autoresUnicos.forEach(nome => {
        const p = document.createElement("p");
        p.textContent = nome;
        p.style.cursor = "pointer"; // Faz parecer clicável
        
        // Adiciona o evento de clique para filtrar por esse autor
        p.addEventListener('click', () => filtrarPorAutor(nome));
        
        filtroContainer.appendChild(p);
    });
}

// Filtra as notas na tela pelo nome do autor
function filtrarPorAutor(nomeAutor) {
    const notas = document.querySelectorAll(".box");
    notas.forEach(nota => {
        const autorDaNota = nota.querySelector(".autor").textContent;
        if (autorDaNota === nomeAutor) {
            nota.style.display = "block";
        } else {
            nota.style.display = "none";
        }
    });
}

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

// Abrir/Fechar nav
open_nav = document.getElementById("open_nav");
Nav = document.getElementById("Nav");
ferramentas_busca = document.getElementById("ferramentas_busca");
filtrar_usuarios = document.getElementById("filtrar_usuarios");
add_button = document.getElementById("add_button");
open_nav.addEventListener("click", function() {
    if (Nav.style.display === "flex") {
        Nav.style.display = "none";
        ferramentas_busca.style.left = "220px";
        add_button.style.right =  "20vw";
        filtrar_usuarios.style.right =  "70px";
    } else {
        Nav.style.display = "flex";
        ferramentas_busca.style.left = "330px";
        add_button.style.right = "10vw";
        filtrar_usuarios.style.right =  "110px";
    }
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
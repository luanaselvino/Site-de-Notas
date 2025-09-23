//add API key sheetDB
const SHEETDB_NOTAS_API_URL = 'https://sheetdb.io/api/v1/i6iwwatljj0kh';

// window.onload = function(){}; a função só é executada quando a página termina de carregar
window.onload =  async function() {
    var usuario_logado = JSON.parse(localStorage.getItem("usuario_logado"));

    if (!usuario_logado) {
        window.location.href = "index.html";
        return;
    }

    try {
        // Busca na API DE NOTAS todas as notas onde a coluna 'UserID' bate com o Id do usuário logado
        const response = await fetch(`${SHEETDB_NOTAS_API_URL}/search?UserID=${usuario_logado.UserID}`);
        const notasDoUsuario = await response.json(); // A resposta é a lista de notas
        
        // Mostra cada nota encontrada na tela
        if (notasDoUsuario.length > 0) {
            notasDoUsuario.forEach(nota => {
                mostrarNota(nota);
            });
        }
    } catch (error) {
        console.error("Erro ao buscar notas do usuário:", error);
    }
};

// Salvar notas criadas (SHEETDB)
document.getElementById("salvar").addEventListener("click", async function() {
    document.getElementById("inserir_nota").style.display = "none";
    
    var titulo = document.getElementById("titulo").value;
    var conteudo = document.getElementById("conteudo").value;
    var usuario_logado = JSON.parse(localStorage.getItem("usuario_logado"));

    if (conteudo !== "" && usuario_logado.UserID) {
        try {
            const novaNota = {
                NotasID: Date.now(),
                UserID: usuario_logado.UserID,
                Titulo: titulo || "Sem título",
                Conteudo: conteudo
            };

            // Usa a API DE NOTAS para criar (POST) uma nova linha
            await fetch(SHEETDB_NOTAS_API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ data: [novaNota] })
            });

            // Limpa os campos
            document.getElementById("titulo").value = "";
            document.getElementById("conteudo").value = "";
            
            mostrarNota(novaNota);

        } catch (error) {
            console.error("Erro ao salvar a nota:", error);
            alert("Não foi possível salvar a nota.");
        }
    }
});

function mostrarNota(nota){
    var box = document.createElement('div');
    box.classList.add('box');
    // Usamos as colunas Titulo e Conteudo que vêm diretamente da planilha de Notas
    box.innerHTML = `
        <div class="titulo">${nota.Titulo}</div>
        <div class="conteudo">${nota.Conteudo}</div>
        <div class="editor">
            <button class="excluir_nota"> <i class="fa-solid fa-eraser"></i> </button>
            <button class="editar_nota"> <i class="fa-solid fa-pen-to-square"></i> </button>
        </div>
    `;

    var excluir_nota = box.querySelector(".excluir_nota");
    excluir_nota.addEventListener("click", async function() {
        if (!confirm("Tem certeza que deseja apagar esta nota?")) {
            return;
        }
        try {
            // Usa a API DE NOTAS para apagar (DELETE) a linha com o ID específico da nota
            await fetch(`${SHEETDB_NOTAS_API_URL}/NotasID/${nota.NotasID}`, {
                method: 'DELETE'
            });
            
            // Remove a nota da tela.
            box.remove();

        } catch (error) {
            console.error("Erro ao excluir a nota:", error);
            alert("Não foi possível excluir a nota. Tente novamente.");
        }
    });

    document.getElementById("main").appendChild(box);
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

    // Remove usuário logado do localStorage
    localStorage.removeItem("usuario_logado");

    // Redireciona para login
    window.location.href = "index.html";

});
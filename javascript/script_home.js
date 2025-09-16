//add API key sheetDB 
const SHEETDB_NOTES_API_URL = 'https://sheetdb.io/api/v1/i6iwwatljj0kh';

// Fechar editor de notas
document.getElementById("close_nota").addEventListener("click", function() {
    document.getElementById("inserir_nota").style.display = "none";

    // Limpar os inputs
    document.getElementById("titulo").value = "";
    document.getElementById("conteudo").value = "";
});

// Salvar notas criadas com SheetDB
document.getElementById("salvar").addEventListener("click", async function() {
    document.getElementById("inserir_nota").style.display = "none";
    
    var titulo = document.getElementById("titulo").value;
    var conteudo = document.getElementById("conteudo").value;

    if (conteudo !== "") {
        // Recupera usuário logado
        // JSON.parse() transforma a informação que estava como texto de volta em objeto de JS
        try {
            var usuario_logado = JSON.parse(localStorage.getItem ("usuario_logado"));
            // Recupera TODAS as notas já salvas
            const notas = await buscarNotas();

            // Verifica se o usuário ainda não tem uma lista de notas
            //Se não tiver, cria uma lista vazia
            if (!notas[usuario_logado.email]) {
                notas[usuario_logado.email] = [];
            }
            // Criar objeto da nova nota
            var novaNota = {
                titulo: titulo || "Sem título",
                conteudo: conteudo
            };

            // Pegamos a lista de notas do usuário atual (notas[usuario_logado.email]) e colocamos a nova nota dentro dela.
            notas[usuario_logado.email].push(novaNota);

            // Salvar de volta no localStorage
            localStorage.setItem("notas", JSON.stringify(notas));

            // Mostrar na tela // Chamar função mostrarNota()
            mostrarNota(novaNota);

            // Limpar os inputs
            document.getElementById("titulo").value = "";
            document.getElementById("conteudo").value = "";
        } catch (error) {
            console.error("Erro ao salvar nota:", error);
            return null;
        }
    }
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
    excluir_nota.addEventListener("click", async function() {

        var usuario_logado = JSON.parse(localStorage.getItem("usuario_logado"));
        await excluirNota(usuario_logado.email, nota.titulo, nota.conteudo);
        box.remove(); // remove da tela
   
        try {
            const response = await fetch(`${SHEETDB_NOTES_API_URL}/Email/${email}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                query: [
                { Email: email, Titulo: titulo, Conteudo: conteudo }
                ]
            })
        });

        if (!response.ok) {
            throw new Error("Erro ao excluir: " + response.status);
            }

            const data = await response.json();
            console.log("Nota excluída:", data);
        } catch (error) {
            console.error("Erro ao excluir:", error);
        }
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

// window.onload = function(){}; a função só é executada quando a página termina de carregar
window.onload = async function() {
    var usuario_logado = JSON.parse(localStorage.getItem("usuario_logado"));

    // Se não tem usuário logado → volta pro login
    if (!usuario_logado) {
        window.location.href = "index.html";
        return;
    }

    var notas = await buscarNotas(usuario_logado.email);

    if (notas.length === 0) {
        // Cria nota inicial
        await salvarNota(usuario_logado.email, "Bem-vindo(a)!", "Esta é sua primeira nota.");
    }

    // Mostrar todas as notas
    const notasAtualizadas = await buscarNotas(usuario_logado.email);
    notasAtualizadas.forEach(nota => {
        mostrarNota(nota);
    });

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
};

// Buscar Usuarios
// async -> permite que o JavaScript não fique travado, esperando uma tarefa longa
// fetch -> manda um pedido para a internet.
// await fetch -> espera até a resposta chegar.
async function buscarNotas(email) {
    try {
        var response = await fetch(SHEETDB_NOTES_API_URL + "/search?Email=" + email); // informações (status da entrega, se deu certo ou erro)
        if (!response.ok) {
            throw new Error("Erro ao buscar notas: " + response.status);
        }
        var data = await response.json(); // os dados de verdade (que você precisava abrir)
        return data; // lista de notas do usuário   
    } catch (error) {
        console.error("Erro:", error);
        return null;
    }
}

// Salvar Notas 
async function salvarNota(email, titulo, conteudo) {
    try {
    /// Buscar todas as notas antes de salvar

        const response = await fetch(SHEETDB_NOTES_API_URL, {
            method: "POST", // criar novo registro
            headers: {
                "Content-Type": "application/json"
            },
            // body -> conteúdo que é enviado para POST
            body: JSON.stringify({
                data: [
                    {
                        Email: email,
                        Titulo: titulo || "Sem título",
                        Conteudo: conteudo
                    }
                ]
            })
        });

        if (!response.ok) {
            throw new Error("Erro ao salvar nota: " + response.status);
        }

        var data = await response.json();
        console.log("Nota salva com sucesso:", data);
        return data;
    } catch (error) {
        console.error("Erro ao salvar nota:", error);
        return null;
    }
}
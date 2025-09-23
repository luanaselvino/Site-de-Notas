//add API key sheetDB -> mudar para .env 
const SHEETDB_USERS_API_URL = 'https://sheetdb.io/api/v1/un4cuz49q5gu6';

// Realizar cadastro
var form_cadastro = document.getElementById("form_cadastro");
var mensagem = document.getElementById("mensagem");

form_cadastro.addEventListener("submit", async function(event){

    event.preventDefault(); // evita recarregar a página

    var nome_cadastro = document.getElementById("nome_cadastro").value;
    var email_cadastro = document.getElementById("email_cadastro").value;
    var senha_cadastro = document.getElementById("senha_cadastro").value;

    try {
        // Buscar todos os usuários no SheetDB
        const usuarios = await buscarUsuario();

        // Verificar se já existe usuário com mesmo email
        var existe = usuarios.find(u => u.Email === email_cadastro);
        if (existe) {
            mensagem.textContent = "Esse email já está cadastrado!";
            mensagem.style.color = "red";
            return;
        }

        // Salvar novo usuário no SheetDB
        await salvarUsuario(nome_cadastro, email_cadastro, senha_cadastro, "admin", "grupoTeste");

        mensagem.textContent = "Conta criada com sucesso";
        mensagem.style.color = "green";

        // Limpar formulário
        form_cadastro.reset();

    } catch (error) {
        console.error("Erro ao cadastrar usuário:", error);
        mensagem.textContent = "Erro ao cadastrar usuário";
        mensagem.style.color = "red";
    }
});

// Entrar com conta existente
var form_login = document.getElementById("form_login");

form_login.addEventListener("submit", async function(event) {

    event.preventDefault();

    var email_login = document.getElementById("email_login").value;
    var senha_login = document.getElementById("senha_login").value;

    try {
        // Buscar todos os usuários no SheetDB
        const usuarios = await buscarUsuario();

        // Verificar se usuário existe
        var user = usuarios.find(u => u.Email === email_login && u.Senha === senha_login);

        if (user) {
            alert("Login realizado com sucesso!");

            // Guardar info de usuário logado
            localStorage.setItem("usuario_logado", JSON.stringify(user));

            window.location.href = "home.html";
        } else {
            alert("Usuário ou senha incorretos");
        }

    } catch (error) {
        console.error("Erro ao tentar logar:", error);
        alert("Erro ao tentar logar");
    }
});

// Entrar como visitante
/*var entrar_visitante = document.getElementById("entrar_visitante");

entrar_visitante.addEventListener("click", function(event) {
    event.preventDefault();

    // Cria um "usuário" especial de visitante
    var visitante = {
        email: "visitante",
        senha: null
    };

    // Logar a conta de visitante
    localStorage.setItem("usuario_logado", JSON.stringify(visitante));

    window.location.href = "home.html";
});
*/

// Buscar Usuarios
// async -> permite que o JavaScript não fique travado, esperando uma tarefa longa
// fetch -> manda um pedido para a internet.
// await fetch -> espera até a resposta chegar.
async function buscarUsuario() {
    try {
        const response = await fetch(SHEETDB_USERS_API_URL); // informações (status da entrega, se deu certo ou erro)
        if (!response.ok) {
            throw new Error("Erro na requisição: " + response.status);
        }
        const data = await response.json(); // os dados de verdade (que você precisava abrir)
        console.log(JSON.stringify(data, null, 2)); // facilitar leitura
        return data;       
    } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        return null;
    }
}

// Salvar Usuarios 
async function salvarUsuario(nome, email, senha, perfil, grupo) {
    try {
    /// Buscar todos os usuários antes de salvar
        const usuarios = await buscarUsuario();

        // Pegar o maior Id existente
        let ultimoId = 0;
        if (usuarios.length > 0) {
            ultimoId = Math.max(...usuarios.map(u => Number(u.UserID) || 0));
        }

        let proximoId = ultimoId + 1;

        const response = await fetch(SHEETDB_USERS_API_URL, {
            method: "POST", // criar novo registro
            headers: {
                "Content-Type": "application/json"
            },
            // body -> conteúdo que é enviado para POST
            body: JSON.stringify({
                data: [
                    {
                        UserID: proximoId,
                        Nome: nome,
                        Email: email,
                        Senha: senha,
                        Perfil: perfil,
                        Grupo: grupo
                    }
                ]
            })
        });

        if (!response.ok) {
            throw new Error("Erro ao salvar: " + response.status);
        }

        const data = await response.json();
        console.log("Usuário salvo com sucesso:", JSON.stringify(data, null, 2));
        return data;
    } catch (error) {
        console.error("Esse email já está cadastrado!", error);
        return null;
    }
}

// NAVEGAÇÃO //
// Voltar para Login
document.getElementById("voltar_login").addEventListener("click", function() {
    window.location.href = "index.html";
});

// Abrir form de cadastro
var link_cadastro = document.getElementById("irParaCadastro");

link_cadastro.addEventListener("click", function() {

    document.getElementById("form_cadastro").style.display="flex";
    document.getElementById("form_login").style.display="none";

});
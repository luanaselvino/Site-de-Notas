let usuarioLogado = null;

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
        await salvarUsuario(nome_cadastro, email_cadastro, senha_cadastro, "Admin", "grupoTeste");

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
            usuarioLogado = user;
            // Guardar info de usuário logado
            localStorage.setItem("usuarioLogado", JSON.stringify(usuarioLogado));

            document.getElementById("form_workplace").style.display = "flex";
            document.getElementById("form_login").style.display="none";
            carregarGruposDoUsuario();
            // window.location.href = "home.html";
        } else {
            alert("Usuário ou senha incorretos");
        }

    } catch (error) {
        console.error("Erro ao tentar logar:", error);
        alert("Erro ao tentar logar");
    }
});

// Entrar no Workplace
var entrar_workplace = document.getElementById("entrar_workplace");
entrar_workplace.addEventListener("click", async function (event) {

    event.preventDefault();

    var workplace_id = document.getElementById("workplace_id").value;
    try {
        // Buscar todos os grupos no SheetDB
        const workplace = await buscarGrupo();

        // Verificar se grupo existe
        var grupo = workplace.find(u => u.GrupoID === workplace_id);

        if (grupo) {
            if (usuarioLogado) {
                // Salvar usuário como participante do grupo
                await salvarParticipante(usuarioLogado, grupo);
            } else {
                alert("Erro: não foi possível identificar o usuário logado.");
                return;
            }

            alert("Login realizado com sucesso!");

            // Guardar info de usuário logado
            localStorage.setItem("grupoLogado", JSON.stringify(grupo));

            window.location.href = "home.html";
        } else {
            alert("Este Workplace não existe");
        }

    } catch (error) {
        console.error("Erro ao tentar logar:", error);
        alert("Erro ao tentar logar");
    }
});

// Criar novo Workplace
var criar_workplace = document.getElementById("form_workplace");
criar_workplace.addEventListener("submit", async function (event) {

    event.preventDefault();

    /* adicionar novo grupo na planilha e logar nele e direcionar para as notas */
})

// Buscar Usuarios
// async -> permite que o JavaScript não fique travado, esperando uma tarefa longa
// fetch -> manda um pedido para a internet.
// await fetch -> espera até a resposta chegar.
async function buscarUsuario() {
    try {
        const response = await fetch(SHEETDB_API.USERS); // informações (status da entrega, se deu certo ou erro)
        if (!response.ok) {
            throw new Error("Erro na requisição: " + response.status);
        }
        const data = await response.json(); // os dados de verdade (que você precisava abrir)
        console.log(JSON.stringify(data, null, 2)); // facilitar leitura
        return data;       
    } catch (error) {
        console.error("Erro ao buscar usuário: ", error);
        return null;
    }
}

async function buscarGrupo() {
    try {
        const response = await fetch(SHEETDB_API.GRUPOS);
        if (!response.ok) {
            throw new Error("Erro na requisição: " + response.status);
        }
        const data = await response.json();
        console.log(JSON.stringify(data, null, 2));
        return data;       
    } catch (error) {
        console.error("Erro ao buscar grupo: ", error);
        return null;
    }
}

async function gruposDoUsuario() {
    try  {
        const response = await fetch(SHEETDB_API.PARTICIPANTES);
        if (!response.ok) {
            throw new Error("Erro ao buscar grupos do usuário: " + response.status);
        }
        const data = await response.json();
        console.log(JSON.stringify(data, null, 2));
        return data;
    } catch (error) {
        console.error("Erro ao buscar grupos do usuário: ", error);
        return null;
    }
}

async function mostrarGrupos(grupo) {
    var ws = document.createElement('div');
    ws.classList.add('ws');
    ws.innerHTML = `
        <span>${grupo.Grupo}</span>
    `;

    ws.addEventListener('click', function() {
        // Loga o usuário diretamente no grupo clicado
        localStorage.setItem("grupoLogado", JSON.stringify(grupo));
        window.location.href = "home.html";
    });

    document.getElementById("ws-salvos").appendChild(ws);
}

async function carregarGruposDoUsuario() {
    if (!usuarioLogado) {
        console.error("Nenhum usuário logado para buscar grupos.");
        return;
    }

    try {
        const responseParticipantes = await fetch(`${SHEETDB_API.PARTICIPANTES}/search?UserID=${usuarioLogado.UserID}`);
        const participacoes = await responseParticipantes.json();

        if (participacoes.length === 0) {
            document.getElementById("ws-salvos").innerHTML = "<p>Não há workplaces salvos.</p>";
            return;
        }
        
        document.getElementById("ws-salvos").innerHTML = ''; 

        // Busca todos os grupos para pegar detalhes
        const responseGrupos = await fetch(SHEETDB_API.GRUPOS);
        const todosOsGrupos = await responseGrupos.json();

        // Para cada participação encontra o grupo correspondente e o exibe
        const idsProcessados = new Set();

        participacoes.forEach(participacao => {
            // Verifica se o ID do grupo já foi processado.
            if (idsProcessados.has(participacao.GrupoID)) {
                return; 
            }

            const detalhesDoGrupo = todosOsGrupos.find(g => g.GrupoID === participacao.GrupoID);
            
            if (detalhesDoGrupo) {
                mostrarGrupos(detalhesDoGrupo);
                // Adiciona o ID do grupo ao conjunto para não processá-lo novamente.
                idsProcessados.add(detalhesDoGrupo.GrupoID);
            }
        });

    } catch (error) {
        console.error("Erro ao carregar os grupos do usuário:", error);
        document.getElementById("ws-salvos").innerHTML = "<p>Erro ao carregar seus workplaces.</p>";
    }
}

// Salvar Usuarios 
async function salvarUsuario(nome, email, senha, perfil) {
    try {
    /// Buscar todos os usuários antes de salvar
        const usuarios = await buscarUsuario();

        // Pegar o maior Id existente
        let ultimoId = 0;
        if (usuarios.length > 0) {
            ultimoId = Math.max(...usuarios.map(u => Number(u.UserID) || 0));
        }

        let proximoId = ultimoId + 1;

        const response = await fetch(SHEETDB_API.USERS, {
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
                        Perfil: perfil
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

// Salvar participantes
async function salvarParticipante(usuario, grupo) {
    try {
        // Verificar se usuário já não é um participante do grupo
        const responseBusca = await fetch(`${SHEETDB_API.PARTICIPANTES}/search?UserID=${usuario.UserID}&GrupoID=${grupo.GrupoID}`);
        const participantes = await responseBusca.json();

        if (participantes.length > 0) {
            console.log("Usuário já é participante deste grupo.");
            return;
        }

        const response = await fetch(SHEETDB_API.PARTICIPANTES, {
            method: "POST", // Criar novo registro
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                data: [
                    {
                        "UserID": usuario.UserID,
                        "Nome": usuario.Nome,
                        "GrupoID": grupo.GrupoID
                    }
                ]
            })
        });

        if (!response.ok) {
            throw new Error("Erro ao salvar participante: " + response.status);
        }

        const data = await response.json();
        console.log("Participante salvo com sucesso:", JSON.stringify(data, null, 2));

    } catch (error) {
        console.error("Ocorreu um erro ao salvar o participante:", error);
    }
}

// NAVEGAÇÃO //
// Voltar para Login
document.querySelectorAll(".voltar_login").forEach(function(botao) {
    botao.addEventListener("click", function(event) {
        event.preventDefault();
        window.location.href = "index.html";
    });
});

// Abrir form de cadastro
var link_cadastro = document.getElementById("irParaCadastro");

link_cadastro.addEventListener("click", function() {

    document.getElementById("form_cadastro").style.display="flex";
    document.getElementById("form_login").style.display="none";

});
// Abrir form de cadastro
var link_cadastro = document.getElementById("irParaCadastro");

link_cadastro.addEventListener("click", function() {

    document.getElementById("form_cadastro").style.display="flex";
    document.getElementById("form_login").style.display="none";

});

// Realizar cadastro
var form_cadastro = document.getElementById("form_cadastro");
var mensagem = document.getElementById("mensagem");

form_cadastro.addEventListener("submit", function(event){

    event.preventDefault(); // evita recarregar a página

    var email_cadastro = document.getElementById("email_cadastro").value;
    var senha_cadastro = document.getElementById("senha_cadastro").value;

    var usuario = {
        email: email_cadastro,
        senha: senha_cadastro
    };

    // Se existir, pega a lista no localStorage
    // Se não existir, cria uma lista vazia []
    var users = JSON.parse(localStorage.getItem("users")) || [];

    // Verificar se já existe usuário com mesmo email
    var existe = users.find(u => u.email === email_cadastro);
    if (existe) {
        mensagem.textContent = "Esse email já está cadastrado!";
        mensagem.style.color = "red";
        return;
    }

    // coloca var "usuario" dentro da lista "users"
    users.push(usuario);

    // Salvar lista atualizada
    // localStorage.setItem("nome_da_chave", "valor_que_quer_guardar");
    localStorage.setItem("users", JSON.stringify(users));

    mensagem.textContent = "Conta criada com sucesso";
    mensagem.style.color = "green";

    // Limpar formulário
    form_cadastro.reset();
});

// Voltar para Login
document.getElementById("voltar_login").addEventListener("click", function() {
    window.location.href = "login.html";
});

// Entrar com conta existente
var form_login = document.getElementById("form_login");

form_login.addEventListener("submit", function(event) {

    event.preventDefault();

    var email_login = document.getElementById("email_login").value;
    var senha_login = document.getElementById("senha_login").value;

    // Recuperar usuários salvos no localStorage
    var users = JSON.parse(localStorage.getItem("users")) || [];

    // Verificar se usuário existe
    var user = users.find(u => u.email === email_login && u.senha === senha_login);

    if (user) {
        alert("Login realizado com sucesso!");

        // Guardar info de usuário logado
        localStorage.setItem("usuario_logado", JSON.stringify(user));

        window.location.href = "index.html";
    } else {
        alert("Usuário ou senha incorretos");
    }

});

// Entrar como visitante
var entrar_visitante = document.getElementById("entrar_visitante");

entrar_visitante.addEventListener("click", function(event) {
    event.preventDefault();

    // Cria um "usuário" especial de visitante
    var visitante = {
        email: "visitante",
        senha: null
    };

    // Logar a conta de visitante
    localStorage.setItem("usuario_logado", JSON.stringify(visitante));

    window.location.href = "index.html";
});
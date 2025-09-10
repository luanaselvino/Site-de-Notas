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

    // Salvar no localStorage
    var users = JSON.parse(localStorage.getItem("users")) || [];

    // Verificar se já existe usuário com mesmo email
    var existe = users.find(u => u.email === email_cadastro);
    if (existe) {
        mensagem.textContent = "Esse email já está cadastrado!";
        mensagem.style.color = "red";
        return;
    }

    // Adicionar novo usuário na lista
    users.push(usuario);

    // Salvar lista atualizada
    localStorage.setItem("users", JSON.stringify(users));

    mensagem.textContent = "Conta criada com sucesso";
    mensagem.style.color = "green";

    // Limpar formulário
    form_cadastro.reset();
});

// Entrar com conta existente
var form_login = document.getElementById("form_login");

if (form_login) {

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

}

// Entrar como visitante
var btnVisitante = document.getElementById("entrar_visitante");

if (btnVisitante) {
    btnVisitante.addEventListener("click", function(event) {
        event.preventDefault();

        // Cria um "usuário" especial de visitante
        var visitante = {
            email: "visitante",
            senha: null
        };

        localStorage.setItem("usuario_logado", JSON.stringify(visitante));

        window.location.href = "index.html";
    });
}

// Abrir form de cadastro
var link_cadastro = document.getElementById("irParaCadastro");

link_cadastro.addEventListener("click", function() {

    document.getElementById("form_cadastro").style.display="flex";
    document.getElementById("form_login").style.display="none";

});

function voltarLogin(){
    window.location.href = "login.html"
}
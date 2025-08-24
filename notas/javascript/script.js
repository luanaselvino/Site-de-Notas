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

function Salvar(){
    document.getElementById("inserir_nota").style.display = "none";
    
    var titulo = document.getElementById("title").value;
    var conteudo = document.getElementById("paragrafo").value;

    if (conteudo !== "") {
        const box = document.createElement('div');
        box.classList.add('box');
        box.innerHTML = `
            <div id="titulo"><h1>${titulo}</h1></div>
            <div id="conteudo">
                <p id="conteudo_editavel">${conteudo}</p>
                <div id="botoes">
                    <button id="editar_nota" class="editar_nota" onclick="editarNota()">
                        <i class="fa fa-pencil"></i>
                    </button>
            
                    <button id="excluir_nota" class="excluir_nota" onclick="excluirNota()">
                        <i class="fa fa-trash fa-lg"></i>
                    </button>
                </div>
            </div>
        `;

        const main = document.getElementById("main");
        main.appendChild(box);

    }
    document.getElementById("title").value = "";
    document.getElementById("paragrafo").value = "";
}

function editarNota() {
    document.getElementById("editar_conteudo").style.display = "block";

    var titulo = document.getElementById("title").value;
    var conteudo = document.getElementById("conteudo_editavel").innerText;



    alert(conteudo)
    document.getElementById("paragrafo").value = conteudo;
    
}


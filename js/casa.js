
const paginas = {
// ==== Violão Popular ====
    "a123": "paginas/violaopopular/aula1.html",
    "1234": "paginas/violaopopular/aula2.html",

  // ===========
    "teoria789": "paginas/aula3.html",
    "harmonia321": "paginas/aula4.html"

    // futuramente:
    // "senha500": "paginas/aula500.html"
};


function entrar(){

    let senha = document.getElementById("senha").value;

    if (paginas[senha]){
        window.location.href = paginas[senha];
    }
    else{
        document.getElementById("mensagem").innerHTML =
        "Senha inválida!";
    }

}

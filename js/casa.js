
const paginas = {

    // ==== Violão Popular ====
    "m": "../aulas/aula_modelo.html",
    "1": "../aulas/aula1.html",
    "2": "../aulas/aula2.html"




  // ===========
 


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

//Carregamento AJAX
let ajax = new XMLHttpRequest();

ajax.open("GET", "./dados.json", true);

ajax.send();

//Monitorar o retorno requisição
ajax.onreadystatechange = function()
{
    //Especificar o container que recebe o conteudo gerado neste arquivo
    let content = document.getElementById("content");

    if (this.readyState == 4 && this.status == 200) {
    
     let data_json = JSON.parse(ajax.responseText);

     if(data_json.length == 0){

        content.innerHTML = '<div class="alert alert-warning" role="alert">Desculpe. Ainda não temos brinquedos cadastrados!</div>';
     
    }else{
        
        let html_content = "";

        for(let i = 0; i<data_json.length; i++){
        
            html_content +='<div class="row"><div class="col-12"><h2><span> </span> '+data_json[i].categoria+'</h2></div></div>';

            if(data_json[i].brinquedos.length == 0){

                html_content += '<div class="row"><div class="col-12"><div class="alert alert-warning" role="alert">Desculpe. Não temos brinquedos para esta categoria.</div></div></div>';

            }else{

                html_content += '<div class="row">';

                for(let j = 0; j<data_json[i].brinquedos.length; j++){                        

                    html_content += card_brinquedo(data_json[i].brinquedos[j].nome,data_json[i].brinquedos[j].imagem,data_json[i].brinquedos[j].valor,data_json[i].brinquedos[j].whatsapp);
    
                }

                html_content += '</div>';                                    
            }

        }

        content.innerHTML = html_content;
        cache_dinamico(data_json);
    }

    }
}


//Template Card Brinquedo
var card_brinquedo = function(nome, imagem, valor, whatsapp)
{

    return '<div class="col-lg-6">'+
                '<div class="card">'+
                    '<img src="'+imagem+'" class="card-img-top" alt="'+nome+'">'+
                    '<div class="card-body">'+
                        '<h5 class="card-title">'+nome+'</h5>'+
                        '<p class="card-text"><strong>Valor:</strong> '+valor+'</p>'+
                        '<div class="d-grid gap-2">'+
                            '<a href="https://api.whatsapp.com/send?phone=55'+whatsapp+'&text=Olá gostaria de informações sobre o brinquedo: '+nome+'" target="_blank" class="btn btn-info">Contato Proprietário</a>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
            '</div>';

}

//Construir o cache dinâmico

var cache_dinamico = function(data_json){

    if('caches' in window){

        console.log("Deletando cache dinâmico antigo");

        caches.delete("brinquedo-app-dinamico").then(function(){

            if(data_json.length > 0){

                var files = ['dados.json'];

                for(let i = 0; i<data_json.length; i++){
                    for(let j = 0; j<data_json[i].brinquedos.length; j++){ 
                        if(files.indexOf(data_json[i].brinquedos[j].imagem) == -1){
                            files.push(data_json[i].brinquedos[j].imagem);
                        }
                        
                    }
                }

            }

            caches.open("brinquedo-app-dinamico").then(function (cache) {

                cache.addAll(files).then(function (){

                    console.log("Novo cache dinâmico adicionado!");

                });

            });

        });

    }

}

//Botão de Instalação

let disparoInstalacao = null;
const btInstall = document.getElementById("btInstall");

let inicializarInstalacao = function(){

    btInstall.removeAttribute("hidden");
    btInstall.addEventListener('click', function(){

        disparoInstalacao.prompt();

        disparoInstalacao.userChoice.then((choice) => {

            if(choice.outcome === 'accepted'){
                console.log("Usuário realizou a instalação");
            }else{
                console.log("Usuário NÃO realizou a instalação");
            }

        });


    });

}
window.addEventListener('beforeinstallprompt', gravarDisparo);

function gravarDisparo(evt){
    disparoInstalacao = evt;
}
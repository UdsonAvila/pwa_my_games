//Carregamento AJAX
let ajax = new XMLHttpRequest();

ajax.open("GET", "./dados.json", true);

ajax.send();

//Monitorar o retorno requisição
ajax.onreadystatechange = function () {
  //Especificar o container que recebe o conteudo gerado neste arquivo

  if (this.readyState == 4 && this.status == 200) {

    let data_json = JSON.parse(ajax.responseText);

    if (data_json.length == 0) {

      content.innerHTML = returnMsnNotRegistered()

    } else {

      let html_content = "";

      for (const element of data_json) {

       

        if (element.jogos.length == 0) {
       

          html_content += returnMsnNotGame();

        } else {

          html_content += '<div class="container-fluid"><div class="row">'

          for (let value of element.jogos) {


            html_content += card_game(value.nome, value.imagem, value.valor, value.whatsapp);

          }

          html_content += '</div></div>';
        }

      }

      content.innerHTML = html_content;
      cache_dinamico(data_json);
    }

  }
}


//Template Card Brinquedo
var card_game = function (nome, imagem, valor, whatsapp) {

  return '<div class="col-lg-5" style="width: 90%">' +
    '<div class="card">' +
    '<h2>' + nome + '</h2>' +
    '</div>' +
    '<div class="row clearPaddingMargin">' +
    '<div class="col-lg-5 clearPaddingMargin">' +
    '<img src="' + imagem + '" class="card-img-top" alt="finalfantasy">' +
    '</div>' +
    '<div class="col-lg-5 clearPaddingMargin" style="display: block;">' +
    '<br>' +
    '<h3>Sinopse</h3>' +
    '<hr>' +
    '<div class="card-text block1">fa fasd f sadf as fas dsf fas dfsad f sadf asd fsadfsa fdf asdfds' +
    '</div>' +
    '<hr>' +
    '<div class="card-text block2">' +
    '<p><strong>Condiçaõ:</strong> Usado</p>' +
    '<p><strong>Troco por:</strong>Final Fantasy X-2, Final Fantasy Tatics</p>' +
    '<p><strong>Vendo por:</strong> ' + valor + ' $</p>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '<div class="row centerDiv">' +
    '<a href="https://api.whatsapp.com/send?phone=55' + whatsapp + '&text=Olá gostaria de informações para trocar o jogo: ' + nome + '" target="_blank" class="btn btn-info" style="width: 40%;margin: 2% "> Trocar</a>' +
    '<a href="https://api.whatsapp.com/send?phone=55' + whatsapp + '&text=Olá gostaria de informações sobre o jogo: ' + nome + '" target="_blank" class="btn btn-info" style="width: 40%;margin: 2% ">Vender</a>' +
    '</div>' +
    '</div>';

}


//Construir o cache dinâmico

var cache_dinamico = function (data_json) {

  if ('caches' in window) {

    console.log("Deletando cache dinâmico antigo");

    caches.delete("brinquedo-app-dinamico").then(function () {

      if (data_json.length > 0) {

        var files = ['dados.json'];

        for (let i = 0; i < data_json.length; i++) {
          for (let j = 0; j < data_json[i].jogos.length; j++) {
            if (files.indexOf(data_json[i].jogos[j].imagem) == -1) {
              files.push(data_json[i].jogos[j].imagem);
            }

          }
        }

      }

      caches.open("brinquedo-app-dinamico").then(function (cache) {

        cache.addAll(files).then(function () {

          console.log("Novo cache dinâmico adicionado!");

        });

      });

    });

  }

}

//Botão de Instalação

let disparoInstalacao = null;
const btInstall = document.getElementById("btInstall");

let inicializarInstalacao = function () {

  btInstall.removeAttribute("hidden");
  btInstall.addEventListener('click', function () {

    disparoInstalacao.prompt();

    disparoInstalacao.userChoice.then((choice) => {

      if (choice.outcome === 'accepted') {
        console.log("Usuário realizou a instalação");
      } else {
        console.log("Usuário NÃO realizou a instalação");
      }

    });


  });

}
window.addEventListener('beforeinstallprompt', gravarDisparo);

function gravarDisparo(evt) {
  disparoInstalacao = evt;
}

// mensagens 
let returnMsnNotGame = function () {

  return '<div class="container-fluid"><div class="row"><div class="col-12"><div class="alert alert-warning" role="alert">'
    + 'Galeria de jogos não cadastrada</div></div></div></div>';


}
let returnMsnNotRegistered = function () {
  return '<div class="alert alert-warning" role="alert">Desculpe. Ainda não temos jogos cadastrados!</div>'
}
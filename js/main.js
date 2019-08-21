// Coleção Pedido
let pedido = {
    cliente: '',
    data: '',
    condicaoDePagamento: '',
    incoterm: '',   
    redespacho: '',    
    itensDoPedido: []
}

// Mapeamento dos campos Pedido
const cliente = document.querySelector('#cliente');
const condicaoDePagamento = document.querySelector('#condicaoDePagamento');
const incoterm = document.querySelector('#incoterm');
const redespacho = document.querySelector('#redespacho');
const data = document.querySelector('#data');
const botaoAnalisarDemanda = document.querySelector('#botaoAnalisarDemanda');
const alertas = document.querySelector('#alertas');

// Mapeamento dos campos Itens do Pedido
const listaDeItens = document.querySelector('#listaDeItens');
const botaoNovoItem = document.querySelector('#botaoNovoItem');
const modal = document.querySelector('.modal');
const tecnologia = document.querySelector('#tecnologia');
const cor = document.querySelector('#cor');
const gramatura = document.querySelector('#gramatura');
const largura = document.querySelector('#largura');
const bobinasPorPacote = document.querySelector('#bobinasPorPacote');
const metragemLinear = document.querySelector('#metragemLinear');
const metrosQuadrados = document.querySelector('#metrosQuadrados');
const precoPorQuilo = document.querySelector('#precoPorQuilo');
const botaoFecharModal = document.querySelector('#botaoFecharModal');
const botaoCancelarModal = document.querySelector('#botaoCancelarModal');

// Populando os Incoterms
let incoterms = ['', 'CIF', 'FOB'];
let listaIncoterms = document.createElement("select");
listaIncoterms.setAttribute("id1", "incotermSelect");
incoterm.appendChild(listaIncoterms);

for (let i = 0; i < incoterms.length; i++) {
    let optionIncoterms = document.createElement("option");
    optionIncoterms.setAttribute("value", incoterms[i]);
    optionIncoterms.text = incoterms[i];
    listaIncoterms.appendChild(optionIncoterms);
}

// Populando as tecnologias
let tecnologias = ['', 'SMS','Spun'];
let listaTecnologias = document.createElement("select");
listaTecnologias.setAttribute("id2", "tecnologiaSelect");
tecnologia.appendChild(listaTecnologias);

for (let i = 0; i < tecnologias.length; i++) {
    let optionTecnologias = document.createElement("option");
    optionTecnologias.setAttribute("value", tecnologias[i]);
    optionTecnologias.text = tecnologias[i];
    listaTecnologias.appendChild(optionTecnologias);
}

// Populando as cores
let cores = ['', 'Amarelo', 'Azul Médico (AM)', 'Azul Steel (AS)', 'Branco', 'Verde'];
let listaCores = document.createElement("select");
listaCores.setAttribute("id3", "corSelect");
cor.appendChild(listaCores);

for (let i = 0; i < cores.length; i++) {
    let optionCores = document.createElement("option");
    optionCores.setAttribute("value", cores[i]);
    optionCores.text = cores[i];
    listaCores.appendChild(optionCores);
}

// Funções de cálculos
function calcularM2porBobina(metragemLinear,largura){
    let larguraEmMetros = largura/1000;
    return metragemLinear * larguraEmMetros;    
}

function calcularM2porPacote(m2porBobina, bobinasPorPacote){
    return m2porBobina * bobinasPorPacote;
}

function calcularBobinas(pacotes, bobinasPorPacote){
    return pacotes * bobinasPorPacote;
}

function calcularPacotes(metrosQuadrados, m2porBobina, bobinasPorPacote){
    let totalDeBobinas = (metrosQuadrados/m2porBobina).toFixed(1);
    return (totalDeBobinas/bobinasPorPacote).toFixed(0);
}

function calcularPesoEmQuilos(metrosQuadrados, gramatura){
    let gramaturaEmQuilos = gramatura/1000;
    return (metrosQuadrados * gramaturaEmQuilos).toFixed(0);
}

function calcularMetrosQuadrados(m2porPacote, pacotes){
    return m2porPacote * pacotes;
}

// Abre o modal para criar novo item do pedido
function abrirModalNovoItem(){
    botaoSalvarItem.classList.add('is-info');
    botaoSalvarItem.classList.remove('is-warning');
    botaoSalvarItem.innerText = "OK";
    botaoExcluirItem.style.visibility="hidden";
    modal.classList.add('is-active');
}

// Fecha o modal dos itens
function fecharModal(){
    modal.classList.remove('is-active');
}

// Abre o modal para alterar item
function alterarItem(e){
    let index = parseInt(e.target.name);    
    listaTecnologias.value = pedido.itensDoPedido[index].tecnologia;
    listaCores.value = pedido.itensDoPedido[index].cor;
    gramatura.value = pedido.itensDoPedido[index].gramatura;
    largura.value = pedido.itensDoPedido[index].largura;
    bobinasPorPacote.value = pedido.itensDoPedido[index].bobinasPorPacote;
    metragemLinear.value = pedido.itensDoPedido[index].metragemLinear;
    metrosQuadrados.value = pedido.itensDoPedido[index].metrosQuadrados;
    precoPorQuilo.value = pedido.itensDoPedido[index].precoPorQuilo;

    botaoSalvarItem.value = index;
    botaoSalvarItem.classList.remove('is-info');
    botaoSalvarItem.classList.add('is-warning');
    botaoSalvarItem.innerText = "Salvar alteração";

    botaoExcluirItem.value = index;
    botaoExcluirItem.style.visibility="visible";

    modal.classList.add('is-active');
}

// Remove item do pedido
function removerItem(e){
    limparCamposItensDoPedido();
    let index = parseInt(e.target.value);    
    pedido.itensDoPedido[index].statusDoItem = "cancelado";
    listaDeItens.removeChild(listaDeItens.childNodes[index]);
    modal.classList.remove('is-active');
}

// Salva ou altera item do pedido
function salvarItem(){
    let m2porBobina = calcularM2porBobina(metragemLinear.value, largura.value);
    let m2porPacote = calcularM2porPacote(m2porBobina, bobinasPorPacote.value);
    let pacotes = calcularPacotes(metrosQuadrados.value, m2porBobina, bobinasPorPacote.value);
    let bobinas = calcularBobinas(pacotes, bobinasPorPacote.value); 
    let metrosQuadradosCalculado = calcularMetrosQuadrados(m2porPacote, pacotes);
    let peso = calcularPesoEmQuilos(metrosQuadradosCalculado, gramatura.value);

    let item = {    
        tecnologia: listaTecnologias.options[listaTecnologias.selectedIndex].value,
        cor: listaCores.options[listaCores.selectedIndex].value,
        gramatura: gramatura.value,
        largura: largura.value,
        bobinasPorPacote: bobinasPorPacote.value,
        metragemLinear: metragemLinear.value,
        metrosQuadrados: metrosQuadradosCalculado,
        m2porBobina: m2porBobina,  
        bobinas: bobinas,  
        pacotes: pacotes,    
        m2porPacote: m2porPacote,    
        peso: peso,    
        precoPorQuilo: precoPorQuilo.value,
        idCiclo: '',
        cicloEscolhido: '',    
        dataDeProducao: '',
        tempoEmEstoque: '',
        pedidoProtheus: '',
        statusDoItem: 'ativo'
    }

    let acao = botaoSalvarItem.innerText;

    if (acao == "OK"){
        pedido.itensDoPedido.push(item);
        let index = pedido.itensDoPedido.length - 1;
        let divField = document.createElement('div');
        divField.classList.add('field');
        
        let divControlCentered = document.createElement('div');
        divControlCentered.classList.add('control'); 
        divControlCentered.classList.add('centered');
    
        let buttonItem = document.createElement('a');
        buttonItem.classList.add('button');
        buttonItem.classList.add('is-primary');
        buttonItem.classList.add('is-fullwidth');
        buttonItem.classList.add('is-medium');
        buttonItem.name = index;
        buttonItem.addEventListener('click', alterarItem);
        
        buttonItem.innerText = pedido.itensDoPedido.length + " - " + item.tecnologia + " " + item.cor + " " + item.gramatura + " gr Largura " + item.largura + " mm";
    
        divControlCentered.append(buttonItem);
        divField.append(divControlCentered);
    
        listaDeItens.append(divField);        
    } else {
        let index = botaoSalvarItem.value;
        let itemNumero = parseInt(index) + 1;
        pedido.itensDoPedido[index].tecnologia = listaTecnologias.options[listaTecnologias.selectedIndex].value;
        pedido.itensDoPedido[index].cor = listaCores.options[listaCores.selectedIndex].value;
        pedido.itensDoPedido[index].gramatura = gramatura.value;
        pedido.itensDoPedido[index].largura = largura.value;
        pedido.itensDoPedido[index].bobinasPorPacote = bobinasPorPacote.value;
        pedido.itensDoPedido[index].metragemLinear = metragemLinear.value;
        pedido.itensDoPedido[index].metrosQuadrados = metrosQuadradosCalculado;
        pedido.itensDoPedido[index].m2porBobina = m2porBobina;
        pedido.itensDoPedido[index].bobinas = bobinas;
        pedido.itensDoPedido[index].pacotes = pacotes;
        pedido.itensDoPedido[index].m2porPacote = m2porPacote;
        pedido.itensDoPedido[index].peso = peso;    
        pedido.itensDoPedido[index].precoPorQuilo = precoPorQuilo.value;
        pedido.itensDoPedido[index].statusDoItem = 'ativo';
        listaDeItens.childNodes[index].childNodes[0].childNodes[0].innerText = itemNumero + " - " + item.tecnologia + " " + item.cor + " " + item.gramatura + " gr Largura " + item.largura + " mm";
    }
   
    limparCamposItensDoPedido();
    modal.classList.remove('is-active');
}

// Analisa a demanda em tempo real
function analisarDemanda() {
    // Analisa a demanda para posterior efetivação
    if(botaoAnalisarDemanda.innerText == "Analisar Demanda"){
        prepararDOMparaAnaliseDemanda();
        preencheColecaoPedido();

        let quantidadeDeItens = parseInt(pedido.itensDoPedido.length);
        
        if (quantidadeDeItens > 0){       
            for (let i = 0; i < quantidadeDeItens; i++) {
                database.ref().child('schedule')
                    .orderByChild('tecnologia')
                    .equalTo(pedido.itensDoPedido[i].tecnologia)
                    .on('child_added', function(snapshot) {
                        let idCiclo = snapshot.key;
                        let registro = snapshot.val();
                        if (registro.cor == pedido.itensDoPedido[i].cor) { 
                            if(pedido.itensDoPedido[i].peso <= registro.volume_disponivel_kg){
                                let tempoEmEstoque = diferencaEntreDatas(registro.data, data.value);
                                if (tempoEmEstoque > 0){
                                    pedido.itensDoPedido[i].idCiclo = idCiclo;
                                    pedido.itensDoPedido[i].cicloEscolhido = registro.ciclo;
                                    pedido.itensDoPedido[i].dataDeProducao = registro.data;
                                    pedido.itensDoPedido[i].tempoEmEstoque = tempoEmEstoque;                                
                                }
                            }                                          
                        }
                });
    
                let item = i + 1;
    
                setTimeout(() => {
                    if (pedido.itensDoPedido[i].cicloEscolhido == "") {
                        pedidoEhViavel = false;
                        let topico = document.createElement('li');
                        topico.innerText = "Item " + item + " - Não há ciclo disponível. Será verificado pelos nossos analistas.";
                        listaAlertas.append(topico);
                    }
                    
                    if (pedido.itensDoPedido[i].cicloEscolhido != "" && pedido.itensDoPedido[i].statusDoItem == "ativo"){
                        let data = pedido.itensDoPedido[i].dataDeProducao;
                        let dataArray = data.split("-");
                        let topico = document.createElement('li');
                        topico.innerText = "Item " + item + " - Será produzido em " + dataArray[2] + "/" + dataArray[1] + " e ficará " + pedido.itensDoPedido[i].tempoEmEstoque + " dias em estoque aguardando faturamento.";
                        listaAlertas.append(topico);                    
                    }
    
                    botaoAnalisarDemanda.classList.remove("is-loading");
                    botaoAnalisarDemanda.classList.remove('is-primary');
                    botaoAnalisarDemanda.classList.add('is-warning');
                    botaoAnalisarDemanda.innerText = "Efetivar o Pedido";
                }, 2000);
            }
        } else {
            botaoAnalisarDemanda.classList.remove("is-loading");
            botaoAnalisarDemanda.classList.add('is-primary');
            botaoAnalisarDemanda.classList.remove('is-warning');
            botaoAnalisarDemanda.innerText = "Analisar Demanda";
    
            let topico = document.createElement('li');
            topico.innerText = "Não há itens para analisar.";
            listaAlertas.append(topico);  
        }  
    }

    // Efetiva o pedido que já teve a demanda analisada
    if(botaoAnalisarDemanda.innerText == "Efetivar o Pedido"){
        inserirPedido(pedido)
            .then(
                function() {
                    botaoAnalisarDemanda.classList.add('is-primary');
                    botaoAnalisarDemanda.classList.remove('is-warning');
                    botaoAnalisarDemanda.innerText = "Analisar Demanda";
                    
                    let topico = document.createElement('li');
                    listaAlertas.innerHTML = "";
                    topico.innerText = "Pedido registrado com sucesso.";
                    listaAlertas.append(topico); 

                    limparCamposCabecalhoDoPedido();
                }
            )
            .catch(error => console.log(error.message))
    }  
}

// Preenche a coleção Pedido com os dados de cabeçalho
function preencheColecaoPedido(){
    pedido.cliente = cliente.value;
    pedido.condicaoDePagamento = condicaoDePagamento.value;
    pedido.incoterm = listaIncoterms.options[listaIncoterms.selectedIndex].value;
    pedido.redespacho = redespacho.value;
    pedido.data = data.value;
}

// Prepara a tela para mostrar o resultado da análise
function prepararDOMparaAnaliseDemanda(){
    alertas.innerHTML = "";

    botaoAnalisarDemanda.classList.add("is-loading");
    let listaAlertas = document.createElement("ul");
    listaAlertas.id = "listaAlertas";

    let fieldAlertas = document.createElement("div");
    fieldAlertas.classList.add("field");

    let boxAlertas = document.createElement("div");
    boxAlertas.classList.add("box");

    let labelAlertas = document.createElement("label");
    labelAlertas.innerText = "Resultado";
    labelAlertas.classList.add("label");

    fieldAlertas.append(listaAlertas);
    boxAlertas.append(fieldAlertas);
                    
    alertas.append(labelAlertas);
    alertas.append(boxAlertas);
}

// Insere novo pedido e recalcula disponibilidade no ciclo
function inserirPedido(pedidoRecebido){   
    // Obtém a chave de um novo pedido
    let novoPedido = database.ref().child('pedidos').push().key;
    let updates = {};

    for (let i = 0; i < pedidoRecebido.itensDoPedido.length; i++) {
        //Adiciona uma referência dos pedidos no dia do ciclo que foi escolhido
        let novoPedidoNoPlano = database.ref().child('schedule').push().key;
        let idCiclo = pedidoRecebido.itensDoPedido[i].idCiclo;
        let dadosNovoPedidoNoPlano = {
            pedido: novoPedido,
            peso: pedidoRecebido.itensDoPedido[i].peso
        };

        updates['/schedule/' + idCiclo + '/pedidos/' + novoPedidoNoPlano] = dadosNovoPedidoNoPlano;

        //Atualiza a disponibilidade em quilos do dia ciclo
        let volumeDisponivelRef = firebase.database().ref('schedule/' + idCiclo);
    
        volumeDisponivelRef.on('value', function(snapshot) {
            let volumeDisponivel = parseInt(snapshot.val().volume_disponivel_kg);
            let volumeReservado = parseInt(snapshot.val().volume_reservado_kg);
            updates['schedule/' + idCiclo + '/volume_disponivel_kg'] = volumeDisponivel - parseInt(pedidoRecebido.itensDoPedido[i].peso);
            updates['schedule/' + idCiclo + '/volume_reservado_kg'] = volumeReservado + parseInt(pedidoRecebido.itensDoPedido[i].peso);
        });  
    }

    updates['/pedidos/' + novoPedido] = pedido;
     
    return database.ref().update(updates);     
}

// Retorna a diferença em dias entre duas datas
function diferencaEntreDatas(dataInicial, dataFinal){
    let inicial = new Date(dataInicial);
    let final = new Date(dataFinal);
    let diferencaEmDias = Math.floor((final - inicial) / 86400000);

    return diferencaEmDias;
}

// REFATORAR Funções do Modal
function dataSelecionada(dataEscolhida){
    pedido.data = dataEscolhida;
    data.value = dataEscolhida;
    botaoAnalise.classList.remove("is-info");
    botaoAnalise.classList.add("is-warning");
    botaoAnalise.innerHTML = "Confirmar";
    fecharModal();
}

// Limpa os campos dos itens do pedido
function limparCamposItensDoPedido(){
    listaTecnologias.selectedIndex = 0;
    listaCores.selectedIndex = 0;
    gramatura.value = ''; 
    largura.value = '';
    bobinasPorPacote.value = ''; 
    metragemLinear.value = ''; 
    metrosQuadrados.value = '';
    precoPorQuilo.value = '';
}

// Limpa os campos dos cabeçalho do pedido
function limparCamposCabecalhoDoPedido(){
    cliente.value = '';
    condicaoDePagamento.value = '';
    listaIncoterms.selectedIndex = 0;
    redespacho.value = '';
    data.value = '';
    listaDeItens.innerHTML = '';

    pedido.cliente = '';
    pedido.data = '';
    pedido.condicaoDePagamento = '';
    pedido.incoterm = '';  
    pedido.redespacho = '';
    pedido.itensDoPedido = [];
    pedido.pedidoProtheus = '';
}

//Atribuição de funções aos botões
botaoNovoItem.addEventListener('click', abrirModalNovoItem);
botaoSalvarItem.addEventListener('click', salvarItem);
botaoFecharModal.addEventListener('click', fecharModal);
botaoCancelarModal.addEventListener('click', fecharModal);
botaoExcluirItem.addEventListener('click', removerItem);
botaoAnalisarDemanda.addEventListener('click', analisarDemanda);

//Dados para teste
// cliente.value = 'Zé das Couves';
// gramatura.value = 10;
// largura.value = 130;
// bobinasPorPacote.value = 9;
// metragemLinear.value = 20500;
// metrosQuadrados.value = 1350000;
// data.value = "2019-07-23";

let newWorker;

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("./pedidos-fitesa-sw.js") // [A]
    .then(function(registration) {
      registration.addEventListener("updatefound", () => { // [B]
        // Uma atualização no Service Worker foi encontrada, instalando...
        console.log("1 - Uma atualização no Service Worker foi encontrada, instalando...");
        newWorker = registration.installing; // [C]

        newWorker.addEventListener("statechange", () => {
          // O estado do Service Worker mudou?
          console.log("2 - O estado do Service Worker mudou?");
          switch (newWorker.state) {
            case "installed": {
              // Existe um novo Service Worker disponível, mostra a notificação
              console.log("3 - Existe um novo Service Worker disponível, mostra a notificação");
              if (navigator.serviceWorker.controller) {
                document.getElementById('update-button').style.display = "block";
                // O evento de clique na notificação
                document.getElementById("update-button").addEventListener("click", function() {
                    newWorker.postMessage({ action: "skipWaiting" });
                })  
                break;
              }
            }
          }
        });
      });

      // SUCESSO - ServiceWorker Registrado
      console.log("4 - ServiceWorker registrado com sucesso no escopo: ", registration.scope);
    })
    .catch(function(err) {
      // ERRO - Falha ao registrar o ServiceWorker
      console.log("5 - Falha ao registrar o ServiceWorker: ", err);
    })
}

let refreshing;

window.addEventListener('appinstalled', (e) => {
    console.log("APP pode ser instalado");
    app.logEvent('a2hs', 'installed');
});

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
  // Update UI to notify the user they can add to home screen
  document.getElementById('add-button').style.display = "block";

  document.getElementById('add-button').addEventListener('click', (e) => {
    // hide our user interface that shows our A2HS button
    document.getElementById('add-button').style.display = 'none';
    // Show the prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }
        deferredPrompt = null;
      });
  });
});

// Esse evento será chamado quando o Service Worker for atualizado
// Aqui estamos recarregando a página
navigator.serviceWorker.addEventListener("controllerchange", function() {
  if (refreshing) {
    return;
  }
  window.location.reload();
  refreshing = true;
  console.log("Refresh foi realizado")
});
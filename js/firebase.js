// Inicializando o Firebase
var config = {
    apiKey: "AIzaSyCsmdTr7pWrTq4wmqTZlcJPg0W-KUkmGYs",
    authDomain: "pedidos-5cad3.firebaseapp.com",
    databaseURL: "https://pedidos-5cad3.firebaseio.com",
    projectId: "pedidos-5cad3",
    storageBucket: "pedidos-5cad3.appspot.com",
    messagingSenderId: "885332186422",
    appId: "1:885332186422:web:b37f73fe2913a48d"
}

firebase.initializeApp(config);

var database = firebase.database();
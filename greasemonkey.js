// ==UserScript==
// @name        Grooveshark Remote
// @namespace   http://github.com/th3osmith/
// @include     http://grooveshark.com/*
// @description Remote control for grooveshark
// @version     1
// @grant       none
// ==/UserScript==

var socket;
var timer = 0
var keepAlive = setInterval(function(){

  var a = new Date()
  socket.send(JSON.stringify(["ping"]));
  
  if (a - timer > 20000) {
    console.log("Connection lost!");
    init();
  } else {
    console.log("Still alive");
  }

}, 10000);

function init() {
  socket = new WebSocket('ws://localhost:12345/groove');

  socket.onmessage = function (msg) {
    arguments = JSON.parse(msg.data);
    timer = new Date();

    console.log(arguments[0]);

    switch(arguments[0]){
      case "connected":
        console.log("Connecté au server Websocket");
        break;
      case "play":
        window.Grooveshark.togglePlayPause();
        break;
      case "next":
        window.Grooveshark.next()
        break;
      case "volume":
        window.Grooveshark.setVolume(arguments[1])
        break;

    }  


  };

  socket.onopen = function() {
      console.log("open");
      socket.send(JSON.stringify(["firefox"]));
  };
}

init();
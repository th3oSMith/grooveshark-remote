// ==UserScript==
// @name        Grooveshark Remote
// @namespace   http://grooveshark.com/*
// @description Remote control for grooveshark
// @version     1
// @grant       none
// ==/UserScript==

var socket = new WebSocket('ws://localhost:12345/groove');

socket.onmessage = function (msg) {
  arguments = JSON.parse(msg.data);
  
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
    socket.send(JSON.stringify(["firefox"]));
};
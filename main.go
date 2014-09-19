package main

import (
	"code.google.com/p/go.net/websocket"
	"log"
	"net/http"
	"os"
)

var client *websocket.Conn
var server *websocket.Conn

func GrooveServer(ws *websocket.Conn) {
	log.Println("Connection d'un client")

	for {

		var arguments []string

		err := websocket.JSON.Receive(ws, &arguments)
		if err != nil {
			log.Println(err)
			log.Println("Déconnection du cient")
			break
		}

		log.Println(arguments)

		if arguments[0] == "firefox" {
			log.Println("Connection d'une instance de Grooveshark")
			client = ws
			cmd := [1]string{"connected"}
			websocket.JSON.Send(client, cmd)
		} else {
			DoAction(arguments)
		}
	}

}

// This example demonstrates a trivial echo server.
func GrooveHandler() {
	log.Println("Serveur lancé sur le port 12345")
	http.Handle("/groove", websocket.Handler(GrooveServer))
	err := http.ListenAndServe(":12345", nil)
	if err != nil {
		panic("ListenAndServe: " + err.Error())
	}
}

func DoAction(arguments []string) {

	if client == nil {
		log.Println("Aucun instance de Grooveshark n'est connectée")
		return
	}

	websocket.JSON.Send(client, arguments)

}

func main() {

	// Analyse des paramètres

	if os.Args[1] == "server" {
		GrooveHandler()

	} else {
		Dial()
		SendAction(os.Args[1:])

	}

}

func Dial() {
	origin := "http://localhost/"
	url := "ws://localhost:12345/groove"
	serv, err := websocket.Dial(url, "", origin)
	if err != nil {
		log.Fatal(err)
	}
	server = serv
}

func SendAction(arguments []string) {

	err := websocket.JSON.Send(server, arguments)
	if err != nil {
		log.Fatal(err)
	}
}

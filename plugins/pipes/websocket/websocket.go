package pipes

import (
	"log"
	"net/http"

	"github.com/gorilla/websocket"

	"github.com/benixos/agi/kits/message"
)

func NewWebsocketPipe() *WebsocketPipe {
	ws := WebsocketPipe{
		clients:   make(map[*websocket.Conn]bool),
		broadcast: make(chan []string),
	}

	return &ws
}

type WebsocketPipe struct {
	Name      string
	clients   map[*websocket.Conn]bool
	broadcast chan []string
}

var clients = make(map[*websocket.Conn]bool) // connected clients
var broadcast = make(chan message.Message)   // broadcast channel

var upgrader = websocket.Upgrader{}

func (ws WebsocketPipe) Connect(messagechannel chan []string) {

}

func (wp WebsocketPipe) HandleConnection(w http.ResponseWriter, r *http.Request) {
	// Upgrade initial GET request to a websocket
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Fatal(err)
	}
	// Make sure we close the connection when the function returns
	defer ws.Close()

	clients[ws] = true

	for {
		var msg message.Message
		// Read in a new message as JSON and map it to a Message object
		err := ws.ReadJSON(&msg)
		if err != nil {
			log.Printf("error: %v", err)
			delete(clients, ws)
			break
		}
		// Send the newly received message to the broadcast channel
		broadcast <- msg
	}
}

func (wp WebsocketPipe) HandleMessages() {
	for {
		// Grab the next message from the broadcast channel
		msg := <-broadcast
		// Send it out to every client that is currently connected
		for client := range clients {
			err := client.WriteJSON(msg)
			if err != nil {
				log.Printf("error: %v", err)
				client.Close()
				delete(clients, client)
			}
		}
	}
}

func (wp WebsocketPipe) SendMessage(target string, message message.Message) {

}

package httpPipe

import (
	"net/http"
	"github.com/gorilla/websocket"

	"github.com/benixos/agi/kits/message"
)

func NewHttpPipe() *HttpPipe {
	www := HttpPipe{
		clients: make(map[*websocket.Conn]bool ) ,
		broadcast: make(chan []string),	
       }

	return &www
}

type HttpPipe struct {
        Name string
	clients map[*websocket.Conn]bool
	broadcast chan []string
}

func (www HttpPipe) Connect(messagechannel chan []string) {
}

func (www HttpPipe) HandleConnection(w http.ResponseWriter, r *http.Request){
}

func (www HttpPipe) HandleMessages() {
}

func  (www HttpPipe) SendMessage(target string, message message.Message) {
}

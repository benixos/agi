package main

import (
	"github.com/benixos/agi/kits/server"
	"github.com/benixos/agi/plugins/pipes/websocket"
)

func main() {
	var wsPipe = pipes.NewWebsocketPipe()

	server := server.NewServer("testServer")
	server.AttachPipe("/ws", wsPipe)
	server.Run()
}

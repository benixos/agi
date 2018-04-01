package main

import(
	"github.com/benixos/agi/kits/server"
	//"github.com/benixos/agi/plugins/pipes/http"
	"github.com/benixos/agi/plugins/pipes/websocket"
)

func main() {

	server := server.NewServer("testServer")

	//var httpPipe = httpPipe.NewHttpPipe()
        //server.AttachPipe("/", httpPipe)

	var wsPipe = pipes.NewWebsocketPipe()
        server.AttachPipe("/ws", wsPipe)
        
	server.Run()
}

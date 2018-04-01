package support

import ( 
	"net/http"

	"github.com/benixos/agi/kits/message"
)

type Pipe interface {
	Connect(messageChannel chan []string)
	HandleConnection(w http.ResponseWriter, r *http.Request)
	HandleMessages()
	SendMessage(target string, message message.Message)
}


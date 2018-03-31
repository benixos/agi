package support

import ( 
	"net/http"
)

type Pipe interface {
	//Open()
	Connect(messageChannel chan []string)
	HandleConnection(w http.ResponseWriter, r *http.Request)
	HandleMessages()
}


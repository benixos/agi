package support

import (
	"net/http"

//	"github.com/dlockamy/protox/bitchain"
//	"github.com/dlockamy/protox/win"
)

type Route struct {
	Name        string
	Method      string
	Pattern     string
	HandlerFunc http.HandlerFunc
}

type Routes []Route

var routes = Routes{
/*	Route{
		"Index",
		"GET",
		"/",
		Index,
	},
	Route{
		"FileShow",
		"GET",
		"/filewatcher",
		serveHome,
	},
	Route{
		"FileShow",
		"GET",
		"/filewatcher/ws",
		serveWs,
	},
	Route{
		"Debug",
		"GET",
		"/debug",
		debugHome,
	},*/
}

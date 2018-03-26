package main

import(
	/*
	"log"
	"net/http"
	"os"
	"os/signal"
	"github.com/coreos/go-systemd/daemon"
*/
	"github.com/benixos/agi/kits/server"
//	"github.com/benixos/agi/kits/support"
)

func main() {
	/*
        sigs := make(chan os.Signal, 1)
        signal.Notify(sigs)

        go func() {
            s := <-sigs
            log.Printf("RECEIVED SIGNAL: %s",s)
            AppCleanup()
            os.Exit(1)
        }()
*/
	server := server.NewServer("testServer")
	server.Run()
/*

	router := support.NewRouter()
	log.Fatal(http.ListenAndServe("0.0.0.0:7018", router))
	daemon.SdNotify(false, "READY=1") 
*/
}
/*
func AppCleanup() {
        log.Println("CLEANUP APP BEFORE EXIT!!!")
}*/

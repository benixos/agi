package main

import(
	"log"
	"net/http"
	"os"
	"os/signal"
	"github.com/coreos/go-systemd/daemon"

	"github.com/dlockamy/agi/kits/app"
)

func main() {	
        sigs := make(chan os.Signal, 1)
        signal.Notify(sigs)

        go func() {
            s := <-sigs
            log.Printf("RECEIVED SIGNAL: %s",s)
            AppCleanup()
            os.Exit(1)
        }()

	router := agi.NewRouter()

	daemon.SdNotify(false, "READY=1") 
}

func AppCleanup() {
        log.Println("CLEANUP APP BEFORE EXIT!!!")
}

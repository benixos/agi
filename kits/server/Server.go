package server

import (
	"log"
	"net/http"
	"os"
	"os/signal"

	"github.com/coreos/go-systemd/daemon"

	"github.com/benixos/agi/kits/support"
)

func NewServer(name string) *Server {
	return &Server{name: name}
}

type Server struct {
	name string
}

func (s *Server) AttachPipe(path string, pipe support.Pipe) {
	http.HandleFunc(path, pipe.HandleConnection)
	go pipe.HandleMessages()
}

func (s *Server) Run() {
	sigs := make(chan os.Signal, 1)
	signal.Notify(sigs)

	go func() {
		s := <-sigs
		log.Printf("RECEIVED SIGNAL: %s", s)
		AppCleanup()
		os.Exit(1)
	}()

	fs := http.FileServer(http.Dir("./build/package.x86_64-pc/"))
	http.Handle("/", fs)

	log.Println("-- http server started on :8000")
	err := http.ListenAndServe(":8000", nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}

	daemon.SdNotify(false, "READY=1")
}

func AppCleanup() {
	log.Println("CLEANUP APP BEFORE EXIT!!!")
}

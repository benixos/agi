package agi

import 

func NewPipe() *Pipe {(
	"github.com/benix/agi/kits/message"
)
	return &Pope{}
}

type Pipe struct {
	name string 
}

func (p *Pipe) Get(name string ) &Message {
	return Message{10,  "testSession","/test","some data"}
} 
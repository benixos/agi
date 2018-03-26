package agi

type Message struct {
	Id	int		`json:"id"`
	Session	string		`json:"session"`
	Path	string		`json:"path"`
	Data	string		`jon:"data"`
}

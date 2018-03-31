package message

type Message struct {
	Id	int		`json:"id"`
	Session	string		`json:"session"`
	Path	string		`json:"path"`
	Data	string		`jon:"data"`

//temp entries
        Email    string `json:"email"`
        Username string `json:"username"`
        Message  string `json:"message"`
}

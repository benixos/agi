package message

type Message struct {
    CloudEventsVersion 	string		`json:"cloudEventsVersion"`
    EventType		string		`json:"eventType"`
    EventTypeVersion 	string		`json:"eventTypeVersion"`
    Source 		string		`json:"source"`
    EventID 		string		`json:"eventID"`
    EventTime 		string		`json:"eventTime"`
    Extensions 		[]string 	`json:"extensions"`
    ContentType 	string 		`json:"contentType"`
    Data 		[]string	`json:"data"`
}

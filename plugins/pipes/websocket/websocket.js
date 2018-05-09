'use strict';

class WebSocketConnection {
    constructor(url, id, key, handler){
	if (url != '' && handler != '') {
             var self = this;
	     this.id = id;
	     this.key = key;
             this.ws = new WebSocket(url);
             this.ws.addEventListener('message', handler);
	}
    }

    send(message){
        if (message != '') {
		console.printf("sending =" + message);
		var data = { message };
		var obj = { "eventType":"com.agi.message", "source":message };// , "data":data};
		this.ws.send( JSON.stringify(obj));
        }
    }
}

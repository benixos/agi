'use strict';

class WebSocketConnection {
    constructor(url, handler){
        var self = this;
        this.ws = new WebSocket('ws://' + window.location.host + '/ws');
        this.ws.addEventListener('message', handler);
        
        /*function(e) {
            var msg = JSON.parse(e.data);
            self.chatContent += '<div class="chip">'
                    + '<img src="' + self.gravatarURL(msg.email) + '">' // Avatar
                    + msg.username
                + '</div>'
                + emojione.toImage(msg.message) + '<br/>'; // Parse emojis

            var element = document.getElementById('chat-messages');
            element.scrollTop = element.scrollHeight; // Auto scroll to the bottom
        });*/
    }

    join() {
        if (!this.email) {
            Materialize.toast('You must enter an email', 2000);
            return
        }
        if (!this.username) {
            Materialize.toast('You must choose a username', 2000);
            return
        }
        this.email = $('<p>').html(this.email).text();
        this.username = $('<p>').html(this.username).text();
        this.joined = true;
    }

    send(){
        if (this.newMsg != '') {
            this.ws.send(
                JSON.stringify({
                    email: this.email,
                    username: this.username,
                    message: $('<p>').html(this.newMsg).text() // Strip out html
                }
            ));
            this.newMsg = ''; // Reset newMsg
        }
    }
}
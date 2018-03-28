/*
*
*
*/

var domChannel = new Channel(0,0,0);

domChannel.agi = 0;

domChannel.connect = function(currentAgI) {
	this.status = channelStatus.CONNECTED;
	//this.agi = currentAgI;
}
    
domChannel.disconnect = function() {
    this.prototype.disconnect();
    this.status = channelStatus.DISCONNECTED;
}
    
domChannel.send = function(path) {
    this.prototype.send(agi.walk(path));
}

domChannel.onmouseup = function(e) {

}

domChannel.onmousemove = function(e) {

}

domChannel.onmousedown = function(e) {
	//message = new AgIpMessage();
	//message.Type = "TPUT";
	//message.Path = "/local/dev/input/mouse";
	//this.agi.Message(message);
}

domChannel.ondrag = function(e) {

}

domChannel.ondrop = function(e) {

}

domChannel.onkeydown = function(e) {

}

domChannel.onkeypress = function(e) {

}

if (typeof document != "undefined") {

    defaultStdOut = "";
    
    document.onmouseup = function(e) {
        if(windowUp(e) === 1)
            e.preventDefault();

	domChannel.onmouseup(e);
    }

    document.onmousemove = function(e)
    {
        //if(windowMove(e) === 1 )
          //  e.preventDefault();

	domChannel.onmousemove(e);      
    };

    document.onmousedown = function(e) {
        if( windowDown(e.target,e) === 1)
            e.preventDefault();

	domChannel.onmousedown(e);       
    };

    document.ondrag = function(e) {
        e.preventDefault();
        console.printf("ondrag<br>");

	domChannel.ondrag(e);
    };
    
    document.ondragstart = function(e) {
        e.preventDefault();
         console.printf("ondragstart<br>");


	domChannel.ondragstart(e);       
    };

    document.ondrop = function(e){
        e.preventDefault();
                console.printf("ondrop<br>");

	domChannel.ondrop(e);
    };
 
    
document.onkeydown=function(event){
  if(event.which == 8) {
    event.preventDefault();
    console.input(event.keyCode);
  }

  domChannel.onkeydown(event);
};

document.onkeypress=function(event)
{
    defaultStdOut = defaultStdOut + event.keyCode;

	if(topclientWindow !== 0){        
		if( winTable.length > 0 && windowTable.findEntryByWinId(topclientWindow.id) != -1) {
			windowTable.findEntryByWinId(topclientWindow.id).owner.KeyDown(event);
		} else {
        		console.input(event.keyCode);
                bufferfile.data = bufferfile.data + String.fromCharCode(event.keyCode);
		}
	} else {
        	console.input(event.keyCode);
	}  
	domChannel.onkeypress(event);
};    
}

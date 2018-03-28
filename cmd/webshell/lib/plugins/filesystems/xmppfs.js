/*
 * Copyright 2009-2015 Douglas Lockamy, dlockamy_at_gmail.com
 * All rights reserved. Distributed under the terms of the MIT License.
 *
 */
var BOSH_SERVICE = 'http://teletron1.softsurve.com:5280/http-bind/';
var connection = null;

var log = function(text) 
{
    agi.log(text);
}

;(function() {
    "use strict";
    
    function noop() {}
    
    Strophe.addConnectionPlugin('agip', {
        
        _con : null,
        
        init: function (connection) {
            this._con = connection;
            Strophe.addNamespace('agip', 'urn:softsurve:agip');
        },
        
        receive: function (msg) {
            var $msg = $(msg);
            var from = $msg.attr('from');
            var id = $m.attr('id');
            console.printf("agip: receive");
            return true;
        },
        
        addAGIPHandler: function(fn) {
                        console.printf("agip: handler");
        }
    });
}());

function onConnect(status)
{
    if (status == Strophe.Status.CONNECTING) {
	log('Strophe is connecting.');
    } else if (status == Strophe.Status.CONNFAIL) {
	log('Strophe failed to connect.');
	$('#connect').get(0).value = 'connect';
    } else if (status == Strophe.Status.DISCONNECTING) {
	log('Strophe is disconnecting.');
    } else if (status == Strophe.Status.DISCONNECTED) {
	log('Strophe is disconnected.');
	$('#connect').get(0).value = 'connect';
    } else if (status == Strophe.Status.CONNECTED) {
	log('Strophe is connected.');
        connection.addHandler(onMessage, null, 'message', null, null,  null);
//        Strophe.addNamespace(‘agixml’, “softsurve:agi”);
        connection.addHandler(onPresence, null, "presence");
        connection.send($pres().tree());
        connection.send($pres() .c("priority").t("100"));
    }
}

function onPresence(presence) {
        var ptype = $(presence).attr('type');
        var from = $(presence).attr('from');
        //var jid_id = Gab.jid_to_id(from);
//console.printf("onPresence");
        if (ptype === 'subscribe') {
            // populate pending_subscriber, the approve-jid span, and
            // open the dialog
            console.printf( "pending_subscriber = "+ from+"<br>");/*
            $('#approve-jid').text(Strophe.getBareJidFromJid(from));
            $('#approve_dialog').dialog('open');*/
        } else if (ptype !== 'error') {
            /*
            var contact = $('#roster-area li#' + jid_id + ' .roster-contact')
                .removeClass("online")
                .removeClass("away")
                .removeClass("offline");*/
            if (ptype === 'unavailable') {
                console.printf("unavailable<br>");//contact.addClass("offline");
            } else {
                console.printf($(presence).find("show").text()+"<br>");
                /*
                var show = $(presence).find("show").text();
                if (show === "" || show === "chat") {
                    contact.addClass("online");
                } else {
                    contact.addClass("away");
                }*/
            }

            //var li = contact.parent();
            //li.remove();
          //  Gab.insert_contact(li);
        } else {
                console.printf($(presence).find("show").text()+"<br>");
        }
        // reset addressing for user since their presence changed
        //var jid_id = Gab.jid_to_id(from);
       // $('#chat-' + jid_id).data('jid', Strophe.getBareJidFromJid(from));
    return true;
}

var chatQueue = [];
var messageQueue = [];

function onMessage(msg) {
    var to = msg.getAttribute('to');
    var from = msg.getAttribute('from');
    var type = msg.getAttribute('type');
    var elems = msg.getElementsByTagName('body');
console.printf("message received<br>");
    if(msg.getElementsByTagName('agip').length > 0){
console.printf("--- agixml received");
        console.printf(msg.getElementsByTagName('agip')[0].innerHTML);
        for(var i = 0, len = msg.getElementsByTagName('agip').length; i < len; i++) {
            onAgIP(msg.getElementsByTagName('agip')[i].innerHTML);
        }
    }

    messageQueue[messageQueue.length] = [from,msg];//chatQueue];

    return true;
}

function onAgIP(msg) {
    console.printf("Processing agixml message"+msg);
    
    if (window.DOMParser)
    {
        console.printf("parser found");

        console.printf(msg);

        console.printf("/////");
    }

    return;
}


function sendMessage(to, msg) {
	var reply = $msg({to: from, from: to, type: 'chat'})
  //          .cnode(Strophe.copyElement(body));
//	connection.send(reply.tree());
    reply.addElement
	//log('ECHOBOT: I sent ' + from + ': ' + Strophe.getText(body));
    
};
//
var xmppFS = new fileSystem();
xmppFS.Name = "xmppfs"; //This is what the user mounts you as
xmppFS.ctlfile = 0;
xmppFS.nodefile = 0;
xmppFS.rootDir = 0;
xmppFS.connectedNodes = null;
xmppFS.read = function(path,flags,offset,length) {    
    var loadPath;
    var readNode;

    if(flags == '0') {
        if(path === "/" || path === "")
            return this.root;
        else if(path === "ctl")
            var simpleNode = this.walk("/ctl") ;
        else if(path.indexOf( "nodes") > -1) {
            
            var simpleNode = this.walk("/nodes") ;
            if(path === "nodes") {
                if(messageQueue == null)
                    simpleNode.putData([]);
                else {
                    var nodeCount = 0;

                    //while(nodeCount < messageQueue.length) {
                        nodefile = new fileNode();
                        nodefile.Name = "message"+nodeCount;
                        nodefile.Type = 1;
                        nodefile.next = 0;
                        nodefile.Data = messageQueue;
                        nodefile.prev = 0;
                        nodefile.Parent = simpleNode;
                     //   nodeCount++;
                   // }
                }
            }
        } else if(path.indexOf( "chat") > -1) {           
            if(path === "/chat") {
                return this.walk("/chat");
            } else {
                if(messageQueue === 0) {
                    return "FILE_NOT_FOUND"
                } else {
                    var nodeCount = 0;
                    var pathObj = path.split("/");
                    var count = 0;
                    
                    while(count < messageQueue.length -1) {
                        console.printf(messageQueue[count][0]+"<br>");
                        count++;
                    }
                   
                   // while(nodeCount < this.connectedNodes.length) {
                        var nodefile = new fileNode();
                        nodefile.Name = "nodes";
                        nodefile.Type = 1;
                        nodefile.next = 0;
                        nodefile.Data = messageQueue;
                        nodefile.prev = 0;
                        nodefile.Parent = simpleNode;
                        nodefile.Parent = agi.walk("/dev");
                        return   nodefile;//nodeCount;//++;
                  //  }
                    return "ERROR_FILE_NOT_FOUND";                
                }
            }
        } else
            return "ERROR_FILE_NOT_FOUND";
        
        
        if(path === "ctl" | path === "chats" | path === "nodes") {
            return this.walk(path);
        }
        else if(path.indexOf("nodes")) {
            nodefile.Parent = this.nodefile.Parent; 
            return nodefile;
        }
    }
    if(flags =='1')
    {
        if(path == "/ctl" )
            return 2;
        else if(path == "/message"|| path == "/nodes")
            return 1;
        else
            return "Error: Read 1";
    }
    else if(flags =='2')
    {    
        return "Error: Read - not a directory";
    }
    else if(flags == '3') { 
        
        var now = new Date();
        
        if(path == "/ctl")
            return now.getHours()+":"+now.getMinutes()+":"+now.getSeconds();
        else if(path == "/nodes") {            
            return now.getMonth()+"/"+now.getDate()+"/"+now.getDate();
        }
        else 
            return "-1";
    }
    else
        return "Error: read 00";
};

xmppFS.write = function(path,flags,buffer,offset,length) {
        if(path === "/ctl")
            var simpleNode = this.ctlfile ;
        else if(path === "/nodes")
            var simpleNode = this.nodefile;
        else if(path === "/")
            var simpleNode = this.rootDir;
        else if(path.indexOf( "/nodes") > -1) {           
            if(path === "/nodes") {
                return "READ_ONLY";
            } else {
                var body = buffer;
                var parsePath = path.split("/");
                if(parsePath.length > 3) {
                    //we expect ./nodes/$username, anything longer than that is an automatic error
                    return "ERROR_INVALID_PATH";   
                }
                
                var sendJID = parsePath[2];
                console.printf("send message to:"+sendJID+"<br>");
                var message = $msg({to: sendJID,
                                "type": "chat"})
                    //.c('body').t(body).up()
                    .c('agip').t(JSON.stringify( new FileNode("/", fileTypes.Dirctory)) ).up()
                    .c('active', {xmlns: "http://jabber.org/protocol/chatstates"});
                connection.send(message);
                return 0;
            }
        }
    
    
    return "READ_ONLY";
};

xmppFS.init = function()
{
    //this.root = new FileNode("/", fileTypes.Dirctory);    
    
    this.ctlfile = new FileNode("ctl",fileTypes.Text);
    this.ctlfile.addParent(this.root);
    this.root.addChild(this.ctlfile);

    this.nodefile = new FileNode("nodes",fileTypes.Text);
    this.nodefile.addParent(this.root);
    this.root.addChild(this.nodefile);

    this.chatDir = new FileNode("chat",fileTypes.Directory);
    this.chatDir.addParent(this.root);
    this.root.addChild(this.chatDir);
};

xmppFS.chatQueue = [];
xmppFS.messageQueue = [];

var message = function() {
    this.from;
    this.type;
    this.body;
    this.threadID;
};

xmppFS.onMessage = function(to, from, type, elems) {
    console.printf("xmppfs.onmessage:<br>");
    console.printf("message recevied from "+from+" to "+"type"+type+"with "+elems+"<br>");
    var count =0;
    xmppFS.chatQueue = [];
    xmppFS.messageQueue = [];
    var name = message_;
    console.printf("adding message from "+from+"<br>");    
    this.messageQueue[this.messageQueue.length] = [from,chatQueue];
    return true;
};


xmppFS.onmount = function(mountpoint, args)   //serverAddress,fs_type,mountPoint,user,pass,argv)
{
    var splitArgs = args.split(":");

    if(splitArgs[0] != "undefined")
        var url = splitArgs[0];
    else
        return false;

    if(splitArgs[1] != "undefined")
        var url = url + ":" +splitArgs[0];

    if(splitArgs[2] != "undefined")
        var userName = splitArgs[0];
    else
        return false;

    if(splitArgs[3] != "undefined")
        var password = splitArgs[0];
    else
        return false;

    connection = new Strophe.Connection(BOSH_SERVICE);
    connection.connect(userName, password, onConnect);
    //this.init();
};

xmppFS.umount = function(mountPoint)
{
    this.connection.disconnect();
};

//Add this filesystem to AgI's FS list so it can be mounted
vfsList[vfsList.length] = xmppFS;
/*
 * Copyright 2009 - 2016 Douglas Lockamy, dlockamy_at_gmail.com
 * All rights reserved. Distributed under the terms of the MIT License.
 */
"use strict";

var agi = new fileSystem();

agi.init = function() {
    this.root = new FileNode("/", writeFlags.CREATEDIR);
    this.mount(0,"rootfs","/","");

    this.write("/local",writeFlags.CREATEDIR,"1", 0, 0);
    this.write("/local/dev", writeFlags.CREATEDIR, "1", 0, 0);
    this.write("/local/dev/message", writeFlags.CREATEDIR, "1", 0, 0);
    this.write("/local/dev/input", writeFlags.CREATEDIR, "1", 0, 0);
    this.write("/local/dev/input/keyboard", writeFlags.CREATEDIR, "1", 0, 0);
    this.write("/local/dev/input/mouse", writeFlags.CREATEDIR, "1", 0, 0);
    this.write("/remote", writeFlags.CREATEDIR, "1", 0, 0);

    this.write("/dev", writeFlags.CREATEDIR, "1", 0, 0);
    
    this.mount(0,"simplefs","/local/dev/clock","");
    this.mount(0,"winfs","/local/dev/win","");
    this.mount(0,"screenfs","/local/dev/screen","");
    this.mount(0,"stdout","/local/dev/stdout","");
    //this.mount(0,"gaeChannelFS","/local/dev/gae","");

    domChannel.connect(this);
}

agi.Shutdown = function() {
    return 0;
}

//login expects channel in format of "#channelType:url:port"
agi.login = function(channel, username, password) {

    var channelArray = channel.split(":");

    switch(channelArray[0]){
        case "#xmpp":
            this.mount(0,"xmppfs","/local/dev/xmpp",channelArray[1]+":"+channelArray[2]+":"+username+":"+password);
        break;
        default:
            return null;
    }
}

function addFS(filesystemArray)
{
    vfsList[fsArray.length-1] = filesystemArray;
}

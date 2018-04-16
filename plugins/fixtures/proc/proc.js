/*
 * Copyright 2009-2015 Douglas Lockamy, dlockamy_at_gmail.com
 * All rights reserved. Distributed under the terms of the MIT License.
 */

var Application = [];

Application = function(name, mime) {
    this.myName = name;
    this.myMIME = mime;
    this.prototype = {};

    this.prototype.Quit = function() {
	return 0;
    };

    this.prototype.Run = function() {
	return 0;
    };

    this.prototype.Pulse = function() {
	return 0;
    };

    this.prototype.MessageReceived = function() {
	return 0;
    };


    this.Quit = function() {
	return this.prototype.Quit();
    };

    this.Run = function() {
	return this.prototype.Run();
    };

    this.Pulse = function() {
	return this.prototype.Pulse();
    };

    this.MessageReceived = function() {
	return this.prototype.MessageReceived();
    };
};



/*
* File API starts here
*/

var timefile = 0;
var datefile = 0;
var clockDir = 0;

var procFS = new fileSystem();

procFS.Name = "procfs"; //This is what the user mounts you as

procFS.read = function(path,flags,offset,length) {    
    var loadPath;
    var readNode;

    if(flags == '0') {
        //simpleNode = new fileNode();
        if(path === "/date")
            var simpleNode = this.walk("/date");
        else if(path === "/time")
            var simpleNode = this.walk("/time");
        else if(path === "/" || path === "")
            var simpleNode = this.root;
        else
            return "Error: File not found";
        
        var now = new Date();
        
        if(path === "/time")
            simpleNode.putData( now.getHours()+":"+now.getMinutes()+":"+now.getSeconds() );
        else if(path === "/date")
            simpleNode.putData( now.getMonth()+"/"+now.getDate()+"/"+now.getFullYear());
        
        if(path === "/clock")
            simpleNode.Parent = agi.walk("/local/dev");
        
        return simpleNode;
    }
    if(flags =='1')
    {
        if(path == "/date" || path == "/time")
            return 2;
        else if(path == "/clock")
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
        
        if(path == "/time")
            return now.getHours()+":"+now.getMinutes()+":"+now.getSeconds();
        else if(path == "/date")
            return now.getMonth()+"/"+now.getDate()+"/"+now.getDate();
        else 
            return "-1";
    }
    else
        return "Error: read 00";
};

procFS.write = function(path,flags,buffer,offset,length) {
    //we are a read only FS
    return "READ_ONLY";
};

procFS.init = function() {
    //We setup file nodes we can send back to callers
    //but we'll generate the .Data dynamically when called.
    
    timefile = new FileNode("time", fileTypes.Text);
    timefile.addParent(this.root);
    this.root.addChild(timefile);

    datefile = new FileNode("date", fileTypes.Text);
    datefile.addParent(this.root);
    this.root.addChild(datefile);
};

procFS.onmount = function(mountPoint)
{
    agi.log("starting procFS");
    this.init();
};

procFS.umount = function(mountPoint)
{
};

//Add this filesystem to AgI's FS list so it can be mounted
vfsList[vfsList.length] = procFS;

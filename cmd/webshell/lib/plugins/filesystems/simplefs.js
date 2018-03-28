/*
 * Copyright 2009-2015 Douglas Lockamy, dlockamy_at_gmail.com
 * All rights reserved. Distributed under the terms of the MIT License.
 *
 * This is an example filesystem/starting point for a real FS
 * When mounted we present two text files named "time" and "date  
 * that when read give the current time or the current date in mm/dd/yyyy format
 */

var timefile = 0;
var datefile = 0;
var clockDir = 0;

var simpleFS = new fileSystem();

simpleFS.Name = "simplefs"; //This is what the user mounts you as

simpleFS.read = function(path,flags,offset,length) {    
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

simpleFS.write = function(path,flags,buffer,offset,length) {
    //we are a read only FS
    return "READ_ONLY";
};

simpleFS.init = function() {
    //We setup file nodes we can send back to callers
    //but we'll generate the .Data dynamically when called.
    
    timefile = new FileNode("time", fileTypes.Text);
    timefile.addParent(this.root);
    this.root.addChild(timefile);

    datefile = new FileNode("date", fileTypes.Text);
    datefile.addParent(this.root);
    this.root.addChild(datefile);
};

simpleFS.onmount = function(mountPoint)
{
    agi.log("starting simpleFS");
    this.init();
};

simpleFS.umount = function(mountPoint)
{
};

//Add this filesystem to AgI's FS list so it can be mounted
vfsList[vfsList.length] = simpleFS;
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

var tickFS = {};
tickFS.Name = "tickfs"; //This is what the user mounts you as

 /*
    FS File Read Flags
    0 Request raw node
    1 Request Type
    2 Return Array of File in Directory
    3 Read text/data file
 */
tickFS.read = function(path,flags,offset,length) {    
    var loadPath;
    var readNode;
//console.printf("tickFS.read "+path+"<br>");
    if(flags == '0') {
        //tickNode = new fileNode();
        if(path === "/date")
            var tickNode = datefile ;
        else if(path === "/time")
            var tickNode = timefile;
        else if(path === "/")
            var tickNode = clockDir;
        else
            return "Error: File not found";
        
        var now = new Date();
        
        if(path === "/time")
            tickNode.Data = now.getHours()+":"+now.getMinutes()+":"+now.getSeconds();
        else if(path === "/date")
            tickNode.Data = now.getMonth()+"/"+now.getDate()+"/"+now.getFullYear();
        
        if(path === "/tick")
            tickNode.Parent = agi.walk("/dev");
        
        return tickNode;
    }
    if(flags =='1')
    {
        if(path == "/date" || path == "/time")
            return 2;
        else if(path == "/tick")
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

tickFS.write = function(path,flags,buffer,offset,length) {
  //we are a read only FS
    return "READ_ONLY";
};

tickFS.init = function()
{
//We setup file nodes we can send back to callers
//but we'll generate the .Data dynamically when called.
    
timefile = new fileNode();
timefile.Name = "time";
timefile.Type = 2;
timefile.next = datefile;
timefile.Data = "";
timefile.prev = 0;
timefile.Parent = clockDir;


datefile = new fileNode();
datefile.Name = "date";
datefile.Type = 2;
datefile.next = 0;
datefile.Data = "";
datefile.prev = timefile;
datefile.Parent = clockDir;


clockDir = new fileNode();
clockDir.Name = "tick";
clockDir.Type = 1;
clockDir.next = 0;
clockDir.Data = [];
clockDir.prev = 0;
clockDir.Parent = 0;

clockDir.Data[0] = timefile;
clockDir.Data[1] = datefile;
};

tickFS.mount = function(serverAddress,fs_type,mountPoint,user,pass,argv)
{
    tickFS.init();
};

tickFS.umount = function(mountPoint)
{

};

//Add this filesystem to AgI's FS list so it can be mounted
//addFS(tickFS);
vfsList[vfsList.length] = tickFS;
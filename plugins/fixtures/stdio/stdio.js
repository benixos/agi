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
var stdioDir = 0;

var stdioFS = new FileSystem();
stdioFS.Name = "stdiofs"; //This is what the user mounts you as

 /*
    FS File Read Flags
    0 Request raw node
    1 Request Type
    2 Return Array of File in Directory
    3 Read text/data file
 */
stdioFS.read = function(path,flags,offset,length) {    
    var loadPath;
    var readNode;
//console.printf("stdioFS.read "+path+"<br>");
    if(flags == '0') {
        //stdioNode = new fileNode();
        if(path === "/date")
            var stdioNode = datefile ;
        else if(path === "/time")
            var stdioNode = timefile;
        else if(path === "/")
            var stdioNode = stdioDir;
        else
            return "Error: File not found";
        
        var now = new Date();
        
        if(path === "/time")
            stdioNode.Data = now.getHours()+":"+now.getMinutes()+":"+now.getSeconds();
        else if(path === "/date")
            stdioNode.Data = now.getMonth()+"/"+now.getDate()+"/"+now.getFullYear();
        
        if(path === "/stdio")
            stdioNode.Parent = this.walk("/dev");
        
        return stdioNode;
    }
    if(flags =='1')
    {
        if(path == "/date" || path == "/time")
            return 2;
        else if(path == "/stdio")
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

stdioFS.write = function(path,flags,buffer,offset,length) {
  //we are a read only FS
    return "READ_ONLY";
};

stdioFS.init = function()
{
//We setup file nodes we can send back to callers
//but we'll generate the .Data dynamically when called.
    
timefile = new fileNode();
timefile.Name = "time";
timefile.Type = 2;
timefile.next = datefile;
timefile.Data = "";
timefile.prev = 0;
timefile.Parent = stdioDir;


datefile = new fileNode();
datefile.Name = "date";
datefile.Type = 2;
datefile.next = 0;
datefile.Data = "";
datefile.prev = timefile;
datefile.Parent = stdioDir;


stdioDir = new fileNode();
stdioDir.Name = "stdio";
stdioDir.Type = 1;
stdioDir.next = 0;
stdioDir.Data = [];
stdioDir.prev = 0;
stdioDir.Parent = 0;

stdioDir.Data[0] = timefile;
stdioDir.Data[1] = datefile;
};

stdioFS.mount = function(serverAddress,fs_type,mountPoint,user,pass,argv)
{
    stdioFS.init();
};

stdioFS.umount = function(mountPoint)
{

};

//Add this filesystem to AgI's FS list so it can be mounted
//addFS(stdioFS);
vfsList[vfsList.length] = stdioFS;

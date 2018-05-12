/*
 * Copyright 2009-2015 Douglas Lockamy, dlockamy_at_gmail.com
 * All rights reserved. Distributed under the terms of the MIT License.
 *
 * This is an example filesystem/starting point for a real FS
 * When mounted we present two text files named "time" and "date  
 * that when read give the current time or the current date in mm/dd/yyyy format
 */

var bufferfile = 0;
var ctlfile = 0;
var stdoutDir = 0;

var stdoutFS = new FileSystem();
stdoutFS.Name = "stdout"; //This is what the user mounts you as

 /*
    FS File Read Flags
    0 Request raw node
    1 Request Type
    2 Return Array of File in Directory
    3 Read text/data file
 */
stdoutFS.read = function(path,flags,offset,length) {  
    switch(path) {      
        case "/ctl": 
            if(flags == '0') {
                return ctlfile;
            } else if(flags == '1' || flags == '2') {
                return 2;
            } else if(flags == '3') {
                return ctlfile.data;
            }
            break;
        case "/buffer":
            if(flags == '0') {
                return bufferfile;
            } else if(flags == '1' || flags == '2') {
                return 2;
            }else if(flags == '3') {
                return bufferfile.data;
            }
            break;
        case "/stdout":
            if(flags == '0') {
                this.stdoutDir.Parent = this.walk("/dev");
                return stdoutDir;
            }
            if(flags == '1')
                return 1;
        default:
            return "Error: File not found";
            break;
    }
};

stdoutFS.write = function(path,flags,buffer,offset,length) {
  //we are a read only FS
    return "READ_ONLY";
};

stdoutFS.init = function()
{
//We setup file nodes we can send back to callers
//but we'll generate the .Data dynamically when called.
    
bufferfile = new FileNode("/buffer",fileTypes.Text);
bufferfile.Name = "buffer";
bufferfile.Type = 2;
bufferfile.next = ctlfile;
bufferfile.data = "";
bufferfile.prev = 0;
bufferfile.Parent = stdoutDir;

ctlfile = new FileNode("/ctl",fileTypes.Text);
ctlfile.Name = "ctl";
ctlfile.Type = 2;
ctlfile.next = 0;
ctlfile.data = "";
ctlfile.prev = bufferfile;
ctlfile.Parent = stdoutDir;

stdoutDir = new FileNode("/",fileTypes.Directory);
stdoutDir.Name = "stdout";
stdoutDir.Type = 1;
stdoutDir.next = 0;
stdoutDir.data = [];
stdoutDir.prev = 0;
stdoutDir.Parent = 0;

stdoutDir.data[0] = bufferfile;
stdoutDir.data[1] = ctlfile;
};

stdoutFS.onmount = function(mountPoint)
{
    this.Log("starting rootfs");
    this.init();
};


stdoutFS.mount = function(serverAddress,fs_type,mountPoint,user,pass,argv)
{
    stdoutFS.init();
};

stdoutFS.umount = function(mountPoint)
{

};

//Add this filesystem to AgI's FS list so it can be mounted
//addFS(stdoutFS);
vfsList[vfsList.length] = stdoutFS;


clearIO = function(type) {    
    if(type == "stdOut")
        bufferfile.data = "";
}


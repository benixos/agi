/*
 * Copyright 2009-2015 Douglas Lockamy, dlockamy_at_gmail.com
 * All rights reserved. Distributed under the terms of the MIT License.
 *
 */

var timefile = 0;
var datefile = 0;
var clockDir = 0;

var rootFS = new FileSystem();

rootFS.Name = "rootfs"; //This is what the user mounts you as

callData = function(url, node) {
    var request = new XMLHttpRequest();
    request.open('GET', url, false);
    request.send(null);

    if(request.status === 200) {
	node.putData(request.responseText); 
    }
}

rootFS.createFileNode = function(path) {
    var pathArray = path.split("/");
    var destDir = "";
    var parentDir = "";
    var x = 0;

    while(x < pathArray.length - 1 ) {
	destDir = destDir + "/" + pathArray[x];
	x++;
    }

x = 0;

    while(x < pathArray.length - 2 ) {
	parentDir = parentDir + "/" + pathArray[x];
	x++;
    }

    if(parentDir == "")
	parentDir = "/";

    if(pathArray[pathArray.length-1] != "") {
    	newfile = new FileNode(pathArray[pathArray.length-1],fileTypes.Text);
    	newfile.addParent(this.Walk(destDir) );
    	this.Walk(destDir).addChild(newfile);

	//callData(path, newfile);

    } else {
    	newfile = new FileNode(pathArray[pathArray.length - 2],fileTypes.Directory);
    	newfile.addParent(this.Walk(parentDir)) ;
    	this.Walk(parentDir).addChild(newfile);
    }

};


rootFS.read = function(path,flags,offset,length) {    
    var loadPath;
    var readNode;

    if(flags == '0') {
        //simpleNode = new fileNode();
        if(path === "/date")
            var simpleNode = this.Walk("/date");
        else if(path === "/time")
            var simpleNode = this.Walk("/time");
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
            simpleNode.Parent = this.Walk("/local/dev");
        
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

rootFS.write = function(path,flags,buffer,offset,length) {
    //we are a read only FS
    return "READ_ONLY";
};

rootFS.init = function() {
    var x = 0;

    while(rootfs_ini[x]) {
	rootFS.createFileNode(rootfs_ini[x]);
	x++;
    }
};

rootFS.onmount = function(mountPoint)
{
    this.Log("starting rootfs");
    this.init();
};

rootFS.umount = function(mountPoint)
{
};

//Add this filesystem to AgI's FS list so it can be mounted
vfsList[vfsList.length] = rootFS;

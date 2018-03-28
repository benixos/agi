/*
 * Copyright 2009 - 2016 Douglas Lockamy, dlockamy_at_gmail.com
 * All rights reserved. Distributed under the terms of the MIT License.
 */
"use strict";

var stdLog = "";
var stdOut = "";

var debugLevel = 10;
var fsArray = [];
var currentDir = "~";
var vfsList = [];
var channelList = [];

var fileTypes =  {
    Directory : 1,
    Text : 2,
    Binary : 3,
    Symlink : 4,
    Mount : 5,
    Union : 6,
    Excutable : 7,
    SPECIALDATA : 8
};

var errors = {
    READ_ONLY : 1,
    WRITE_ONLY : 2
};

var readFlags = {
    CHECKDIR : 1,
    GETFILENODE : 2,
    GETFILEDATA : 3,
    GETFILEURL : 4
};

var writeFlags = {
    DELETE : 0,
    CREATEDIR : 1,
    CREATEDATAFILE : 2,
    CREATELINK : 3,
    CREATEUNIONLINK : 4
};

var channelStatus = {
    DISCONNECTED : 0,
    CONNECTING : 1,
    CONNECTED : 2
};

var AgIpMessage = function(){
    this.TID = "";
    this.type = "";
    this.path = "";
    this.message = "";
    this.sessionid = "";
    this.uname = "";
    this.mode = "";
    this.stat = "";
    this.offset = "";
    this.count = "";
    this.data = "";
    this.groups = "";
    this.filetype = 0;
}

var Channel = function (url, user, pass) {
    this.prototype = {};
    this.status;
    this.username;
    this.url;
    this.sessionID;
    this.connect = function(url, user, pass) {
      this.username = user;
      this.url = url;
        
      this.status = channelStatus.CONNECTING;    
        
      if( this.prototype.connect(user, pass) )
          this.status = channelStatus.CONNECTED
      else
          this.status = channelStatus.DISCONNECTED;
    }
    
    this.prototype.connect = function(user, pass) {
        return 0;
    }
    
    this.disconnect = function() {
        this.prototype.disconnect();
        this.status = channelStatus.DISCONNECTED;
    }
    
    this.prototype.disconnect = function() {
        
    }
    
    this.send = function(path) {
        this.prototype.send(agi.walk(path));
    }
    
    this.prototype.send = function(node) {
        
    }
    
    return this;
}

var FileNode = function(name, nodeType) {
    this.Parent;
    this.Name = name;
    this.meta = '{ "owner:local", "perm:755", "mime:text/plain" }';
    this.next = null;
    this.prev = null;
    this.Type = nodeType;
    this.watchers = [];
    this.Data = null;
    this.dirList = [];
    this.mounted = null;
    this.symNode = null;
    this.fsReserved = null;

    this.addChild = function(newDir)
    {
        if (this.Type == fileTypes.Directory)
        {
            if(this.dirList.length == 0)
                this.dirList = [newDir]
            else {
                var prev = this.dirList[this.dirList.length-1];
                this.dirList = this.dirList.concat(newDir);
                var newItem = this.dirList[this.dirList.length-1]; 
                prev.next = newItem;
                newItem.prev = prev;
            }
            return 0;
        }
        else
            return -1;
    }

    this.getName = function()
    {
        return this.Name;
    }

    this.setName = function(name)
    {
        this.Name = name;
        return 0;
    }

    this.getType = function()
    {
        return this.Type;
    }

    this.getSym = function()
    {
        if (this.Type == fileTypes.Symlink && this.symNode != null)
            return this.symNode;
        else
            return null;
    }

    this.setSym = function(link)
    {
        if (this.Type == fileTypes.Symlink && link != null)
        { 
            this.symNode = link;
            return 0;
        }
        else
            return -1;
    }

    this.addParent = function(parent)
    {
        this.Parent = parent;
        return 0;
    }

    this.getParent = function()
    {
        return this.Parent;
    }

    this.setType = function(type)
    {
        this.Type = type;
        return 0;
    }

    this.setNext = function(nextNode)
    {
        if(nextNode != null)
        {
            this.next = nextNode;
            return 0;
        }
        else
            return -1;
    }

    this.setPrev = function(prevNode)
    {
        if (prevNode != null)
        {
            this.prev = prevNode;
            return 0;
        }
        else
            return -1;
    }

    this.getMount = function()
    {
        if (this.Type == fileTypes.Mount)
        {
            if (this.mounted != null)
                return this.mounted;
            else
                return null;
        }
        else
            return null;
    }

    this.setMount = function(mount)
    {
        if (this.Type == fileTypes.Mount)
        {
            if (this.mounted == null)
            {
                this.mounted = mount;
                return 0;
            }
            else
                return -1;
        }
        else
            return -1;
    }

    this.getNext = function()
    {
        return this.next;
    }

    this.getPrev = function()
    {
       return this.prev;
    }

    this.getMeta = function()
    {
        return this.meta;
    }

    this.getData = function()
    {
        if (this.Type == fileTypes.Binary || this.Type == fileTypes.Text)
            return this.Data;
        else
            return "-1";
    }

    this.putData = function(buffer)
    {
        if (this.Type == fileTypes.Binary || this.Type == fileTypes.Text)
        {
            //alert(buffer);
            this.Data = buffer;
            return 0;
        }
        else
            return -1;
    }

    this.getDirList = function()
    {
            return this.dirList;
    }

    this.countChildren = function()
    {
        if (this.dirList != null)
            return this.dirList.Count;
        else
            return -1;
    }
 
    this.addWatcher = function(newWatcher)
    {
        this.watchers[this.watchers.length] = newWatcher;
        return this.watchers.length - 1;
    }

    this.removeWatcher = function(callback, watcher)
    { 
        if (this.watchers[watcher] == callback)
        {
            return 1;
        }
        else
            return -1;
    }

    this.getDirEntry = function(dirCount)
    {
        if (this.Type == fileTypes.Binary)
            return this.dirList.ElementAt(dirCount);
        else
            return null;
    }
    return this;
}

var fileSystem = function() {
    this.prototype = {};
    this.root= new FileNode("/", fileTypes.Directory);
    this.prototype.parent = this;
    this.init = function()
    {
        //this.root = new FileNode("/", fileTypes.Directory);
        return this.root;
    }

    this.Message = function(message){
	var rmessage = new AgIpMessage();

	switch( message.Type) {
	case "TVERSION":
            rmessage.TID = rmessage.TID
            rmessage.Type = "RVERSION"
            rmessage.Message = "0.1"
	    break;

	case "TREG" :
            rmessage.Type = "RERROR"
	    break;

	case "RREG" :
            rmessage.Type = "RERROR"
	    break;

	case "TLOGIN" :
            rmessage.Type = "RERROR"
	    break;

	case "TATTACH" :
            rmessage.TID = rmessage.TID;
            rmessage.Type = "RERROR" //"RATTACH";
            rmessage.Message = "0.1";
	    break;

	case "TPUT" :
            rmessage.Type = message.Type;
            //rmessage.SessionID = message.SessionID;
            //rmessage.Path = message.Path;           
            var alpha = this.tput(message);//this.write(message.Path, message.Message, 0,  message.SessionID, message);
            
            if(alpha > 0) {
                rmessage.Path = message.Path;
                rmessage.Type = "RPUT";
                rmessage.Message = "Success";
            } else {
                 rmessage.Path = "/dev/null";
                 rmessage.Type = "RERROR";
                 rmessage.Message = "Invalid write operation" ;
	    }
	    break;

	case "TGET" :
            rmessage.TID = message.TID;
            rmessage.SessionID = message.SessionID;
            rmessage.Path = message.Path;
            var tmpFile = this.tput(message);//Agi.read(rmessage.Path,0,0, rmessage.SessionID);
            if(tmpFile.Path != "/dev/null") {
                rmessage.Type = "RGET";
                rmessage.Path = tmpFile.Path;
                rmessage.Data = tmpFile.Data;
                rmessage.FileType = tmpFile.Type;
            } else {
                rmessage.Type = "RERROR";
                rmessage.FileType = -1;
	    }
	    break;

	case "TMESSAGE" :
            rmessage.TID = rmessage.TID;
            rmessage.Type = "RERROR" //"RMESSAGE";
            rmessage.Message = "0.1";
	    break;

	case "TREMOVE" :
            rmessage.TID = rmessage.TID;
            rmessage.Type = "RERROR" //"RREMOVE";
            rmessage.Message = "0.1";
	    break;

	case "TFLUSH" :
            rmessage.TID = rmessage.TID;
            rmessage.Type = "RERROR" //"RFLUSH";
            rmessage.Message = "0.1";
	    break;

        default:
            rmessage.Type = "RERROR";
	}

    return rmessage
}

    this.read = function(path, flags, offset, length)
    {
        return this.prototype.read(path, flags, offset, length);
    }
        
    this.prototype.read = function(path, flags, offset, length)
    {
        var loadPath;
        var readNode;
        var readNode = this.walk(path);

        if (readNode != null && readNode.getType() == fileTypes.Mount)
        {
            loadPath = this.parsePath(readNode, path);

            //if (loadPath == "/")
              //  return readNode;
            //else
                return readNode.getMount().read(loadPath, flags,0,0); 
        }
        else
            return readNode;
    }

    this.parsePath = function(mNode, loadPath)
    {
        return  this.parsePath(mNode, loadPath);
    }
    
    this.prototype.parsePath = function(mNode, loadPath)
    {
        var mPath = "";
        var counter = 0;

        var pathArray = loadPath.split('/');

        while (pathArray[counter] != mNode.getName() && counter < pathArray.length)
        {
            counter++;
        }

        //skip the mount point's name
        counter++;

        while (counter < pathArray.length)
        {
            mPath = mPath + "/" + pathArray[counter];
            counter++;
        }
        if (mPath != null)
            return mPath;
        else
            return ("/");
    }

    this.touched = function(node){
        return this.prototype.touched(node);
    }
    
    this.prototype.touched = function(node){
	var x = 0;
	while(x < node.watchers.length) {
	 if(typeof node.watchers[x] === "function") {
		agi.log("running call back " + x);
		var callback = node.watchers[x];
		callback();
	 } else
		agi.log("failed to run callback "+x);
	 x++;
	}

        return x;
    }

    this.onmount = function(mountPoint)
    {
        return this.prototype.onmount(mountPoint);       
    }
    
    this.prototype.onmount = function(mountPoint)
    {
        return this;
    }

    this.getWorkPath = function(path)
    {
        return this.prototype.getWorkPath(path)        
    }
    
    this.prototype.getWorkPath = function(path)
    {
        var workPath = "/";
        var counter = 0;
        var pathArray = path.split('/');

        while (counter <= pathArray.length - 2)
        {
            if (workPath == "/")
                workPath = workPath + pathArray[counter];
            else
                workPath = workPath + '/' + pathArray[counter];
            counter++;
        }

        return workPath;
    }

    this.getWorkPathArray = function(path)
    {
        return this.prototype.getWorkPathArray(path)        
    }
        
    this.prototype.getWorkPathArray = function(path)
    {
        var workPath = "/";
        var counter = 0;
        var pathArray = path.split('/');

        while (counter <= pathArray.length - 2)
        {
            if (workPath == "/")
                workPath = workPath + pathArray[counter];
            else
                workPath = workPath + '/' + pathArray[counter];
            counter++;
        }

        return pathArray;
    }
    
    this.getNewfileName = function(path)
    {
        var pathArray = path.sasl_digest_md5plit('/');
        return pathArray[pathArray.length - 1];
    }

    this.prototype.write = function(path, flags, buffer, offset, length)
    {
        var workPath = "/";
        var aNode;
        var pathArray = path.split('/');
        var counter = 0;
        var loadPath = "";
        var newDir;
        var newfile;

        while (counter <= pathArray.length - 2)
        {
            if (workPath == "/")
                workPath = workPath + pathArray[counter];
            else
                workPath = workPath + '/' + pathArray[counter];
            counter++;
        }

        if (flags == writeFlags.DELETE)
        {
            //unlink a node
            counter = 0;
            aNode = this.walk(path);

            if(aNode == null)
                return -1;
            
            if (aNode.getType() == fileTypes.Mount)
            {
                loadPath = this.parsePath(aNode, path);
                return (aNode.getMount().write(loadPath, flags, buffer, offset, length));
            }
            if (aNode.getType() == fileTypes.Symlink)
            {
                fileStruct = path.split('/');
                remPath = aNode.getName() + "/" + fileStruct[fileStruct.length - 1];
                return (this.write(remPath, flags, buffer, offset, length));
            }
            if (aNode.getType() == fileTypes.Union)
            {
                fileStruct = path.split('/');
                counter = 0;

                while (counter < aNode.getDirList().Count)
                {
                    remPath = aNode.getDirList()[counter] + "/" + fileStruct[fileStruct.length - 1];
                    this.write(remPath, flags, buffer, offset, length);
                    counter++;
                }
                return 0;
            }
            prevNode = aNode.getPrev();
            nextNode = aNode.getNext();

            while (aNode.getParent().getDirList()[counter].getName() != aNode.getName() && counter < aNode.getParent().getDirList().Count)
            {
                counter++;
            }

            prevNode.setNext(nextNode);
            nextNode.setPrev(prevNode);
            return 0;
        }

        if (flags == writeFlags.CREATEDIR)
        {
            aNode = this.walk(workPath);

            if(aNode == null) {
                return -1;
            }
            
            if ( aNode.getType() == 1 && buffer == "1")
            {
                newDir =  new FileNode(pathArray[pathArray.length - 1], fileTypes.Directory);
                newDir.addParent(aNode);
                aNode.addChild(newDir);

                if (aNode.countChildren() > 0)
                {
                    newDir.setPrev(aNode.getDirList().ElementAt(aNode.countChildren()-1));
                }

                if (aNode.countChildren() >= 2)
                {
                    aNode.getDirList()[aNode.countChildren() - 2].setNext(newDir);
                }

                this.touched(aNode);
                return 0;
            }
            else if (aNode.getType() == fileTypes.Symlink)
            {
                return (this.write(aNode.getSym() + "/" + pathArray[pathArray.length - 1], flags, buffer, offset, length));
            }

            else if (aNode.getType() == fileTypes.Mount)
            {
                loadPath = this.parsePath(aNode, path);
                return (aNode.getMount().write(loadPath, flags, buffer, offset, length));
            }
            else if (aNode.getType() == fileTypes.Union)
            {
                loadPath = this.parsePath(aNode, path);
                count = 0;
                while (count < aNode.getDirList().Count)
                {
                    this.touched(aNode);
                    this.write(aNode.getDirList()[count] + loadPath, flags, buffer, offset, length);
                    count++;
                }
                return (0);
            }
            else
                return -1;

        }
        else if (flags == writeFlags.CREATEDATAFILE)
        {
            aNode = this.walk(workPath);
            
            //if(aNode == null)
              //  alert(workPath);
            
            if (aNode.getType() == 1)
            {
                var count = 0;
                if (aNode.getDirList().Count > 0)
                {
                    while (count < aNode.getData().length - 1 && aNode.getDirList()[count].getName() != pathArray[pathArray.length - 1])
                    {
                        count++;
                    }
                    aNode.getDirList();
                    if (aNode.getDirList()[count].getName() == pathArray[pathArray.length - 1] && aNode.getDirList()[count].getName() != "")
                    {
                        aNode.getDirList()[count].putData(buffer);
                        this.touched(aNode);
                        return 0;
                    }
                }

                var newFile = new FileNode(pathArray[pathArray.length - 1], fileTypes.Text);

                newFile.addParent(aNode);
                aNode.addChild(newFile);

                if (aNode.countChildren() > 0)
                {
                    newFile.setPrev(aNode.getDirList().ElementAt(aNode.countChildren() - 1));
                }

                if (aNode.countChildren() >= 2)
                {
                    aNode.getDirList()[aNode.countChildren() - 2].setNext(newFile);
                }

                newFile.putData(buffer);
                this.touched(aNode);
                return 0;
            }

            else if (aNode.getType() == fileTypes.Mount)
            {
                loadPath = this.parsePath(aNode, path);
                return aNode.getMount().write(loadPath, flags, buffer, offset, length);
            }
            else if (aNode.getType() == fileTypes.Union)
            {
                loadPath = this.parsePath(aNode, path);
                counter = 0;

                while (counter < aNode.getData().length)
                {
                    this.touched(aNode);
                    this.write(aNode.getDirList()[counter] + loadPath, flags, buffer, offset, length);
                    counter++;
                }
                return 0;
            }
            else
                return -2;
        }

        else if (flags == 3)
        {
            aNode = this.walk(workPath);
            var bNode = this.walk(buffer);

            if (bNode.getType() == fileTypes.Directory || bNode.getType() == fileTypes.Mount)
            {
                if (aNode.getType() == fileTypes.Directory)
                {
                    newDir = aNode.getDirList()[aNode.getDirList().Count] = new FileNode(pathArray[pathArray.length - 1], fileTypes.Symlink);
                    newDir.setSym(bNode);

                    newDir.addParent(aNode);
                    aNode.addChild(newDir);

                    if (aNode.countChildren() > 0)
                    {
                        newDir.setPrev(aNode.getDirList().ElementAt(aNode.countChildren() - 1));
                    }

                    if (aNode.countChildren() >= 2)
                    {
                        aNode.getDirList()[aNode.countChildren() - 2].setNext(newDir);
                    }

                    this.touched(aNode);
                    return 0;
                }

                else if (aNode.getType() == fileTypes.Mount)
                {
                    loadPath = this.parsePath(aNode, path);
                    this.touched(aNode);
                    return (aNode.getMount().write(loadPath, flags, buffer, offset, length));
                }

                else
                    return -3;
            }
            if (bNode.getType() == fileTypes.Mount)
            {
                if (aNode.getType() == fileTypes.Directory)
                {

                    newfile = aNode.getDirList()[aNode.getDirList().Count] = new FileNode(pathArray[pathArray.length - 1], fileTypes.Symlink);
                    newfile.setSym(bNode);
                    newfile.addParent(aNode);
                    aNode.addChild(newfile);
                 
                    if (aNode.countChildren() > 0)
                    {
                        newfile.setPrev(aNode.getDirList().ElementAt(aNode.countChildren() - 1));
                    }

                    if (aNode.countChildren() >= 2)
                    {
                        aNode.getDirList()[aNode.countChildren() - 2].setNext(newfile);
                    }

                    this.touched(aNode);
                    return 0;
                 }

                if (aNode.getType() == fileTypes.Mount)
                {
                    loadPath = this.parsePath(aNode, path);
                    this.touched(aNode);
                    return (aNode.getMount().write(loadPath, flags, buffer, offset, length));
                }
                else
                    return -3;
            }
            if (bNode.getType() == fileTypes.Union)
            {
                if (aNode.getType() == 1)
                {
                    newfile = new FileNode(pathArray[pathArray.length - 1], 4);
                    aNode.getDirList()[aNode.getDirList().Count] = newfile;
                    /*
                    newfile.Name = pathArray[pathArray.length - 1];
                    newfile.Type = 4;
                    newfile.next = 0;
                    newfile.Data = buffer;
                    newfile.prev = aNode.Data[aNode.Data.length - 1];
                    newfile.Parent = aNode;

                    if (aNode.Data.length >= 2)
                    {
                        aNode.Data[aNode.Data.length - 2].next = newfile;
                    }*/
                    this.touched(aNode);
                    return 0;
                }

                if (aNode.getType() == fileTypes.Mount)
                {
                    loadPath = this.parsePath(aNode, path);
                    this.touched(aNode);
                    return aNode.getMount().write(loadPath, flags, buffer, offset, length);
                }
                else
                    return -4;
            }

            else
                return bNode.getType();
        }
        else if (flags == fileTypes.Symlink)
        {
            aNode = this.walk(workPath);

            if (aNode.getType() == fileTypes.Directory)
            {/*
                newfile = 0;
                newfile = aNode.Data[aNode.Data.length] = new fileNode();
                newfile.Name = pathArray[pathArray.length - 1];
                newfile.Type = 3;
                newfile.next = 0;
                newfile.Data = buffer;
                newfile.prev = aNode.Data[aNode.Data.length - 1];
                newfile.Parent = aNode;
                //newfile.watchers = [];
                //newfile.meta = [];
                //newfile.watchers = [];
                //newfile.meta = ["owner:local", "perm:755", "type:type/default"];
                if (aNode.Data.length >= 2)
                {
                    aNode.Data[aNode.Data.length - 2].next = newfile;
                }*/
                this.touched(aNode);
                 return 0;
            }

            else if (aNode.getType() == fileTypes.Mount)
            {
                loadPath = this.parsePath(aNode, path);
                this.touched(aNode);
                return (aNode.getMount().write(loadPath, flags, buffer, offset, length));
            }

            else if (aNode.getType() == fileTypes.Union)
            {
                loadPath = this.parsePath(aNode, path);

                counter = 0;
                /*
                while (counter < aNode.Data.length)
                {
                    this.touched(path);
                    this.journal.write(path, buffer);
                    this.write(aNode.Data[counter] + loadPath, flags, buffer, offset, length, this.sessionKey);
                    counter++;
                }*/

                return 0;
            }

            else
                return -2;
        }
        else if (flags == 5)
        {
            aNode = this.walk(workPath);
            
            if(aNode == null)
                return -1;
            
            if (aNode.getType() == fileTypes.Directory)
            {/*
                aNode.Data[aNode.Data.length] = new fileNode();
                newDir = 0;
                newDir = aNode.Data[aNode.Data.length - 1];
                newDir.Name = pathArray[pathArray.length - 1];
                newDir.Type = 7;
                newDir.next = 0;
                newDir.Data = buffer;
                newDir.prev = aNode.Data[aNode.Data.length - 1];
                newDir.Parent = aNode;
                //newDir.watchers = [];
                //newDir.meta = ["owner:local", "perm:755", "type:type/default"];*/
                this.touched(aNode);
                return 0;
            }

            if (aNode.getType() == fileTypes.Directory)
            {
                loadPath = this.parsePath(aNode, path);
                this.touched(aNode);

                return (aNode.getMount().write(loadPath, flags, buffer, offset, length));
            }

            else
                return -4;
        }
        else if (flags == fileTypes.Mount)
        {
            if (this.walk(path) != null)
            {
                aNode = this.walk(path);

                if (aNode.getType() == 5)
                {
                    return -1;
                }
                if (aNode.getType() == fileTypes.Union)
                {
                    //aNode.Data[aNode.Data.length] = buffer;
                    this.touched(aNode);
                    return 0;
                }
                else
                    aNode.putData(  buffer);
                return 0;
            }
            else
                return -5;
        }
        else
            return -10;
    }

    this.write = function(path, flags, buffer, offset, length)
    {
        return this.prototype.write(path, flags, buffer, offset, length);
    }    

    this.walk = function(path)
    {
        return this.prototype.walk(path);
    }
    
    this.prototype.walk = function(path)
    {
        var startNode = this.parent.root;
        var aNode = null;
        if (path == null || path == "" || path.length < 1)
            return null;
        
        if (path.length == 1 && path[0] == '/')
        {         
            return startNode;
        }

        if (path[0] != '/')
        {
            path = '/' + path;
        }
        
        var nodeArray = path.split('/');

        if (startNode.getDirList().length != 0)
            aNode = startNode.getDirList()[0];

        var depth = 1;
 
        while (aNode != null && aNode.getName() != nodeArray[nodeArray.length - 1] && depth <= nodeArray.length)
        {
            while (aNode.getName() != nodeArray[depth] && depth <= nodeArray.length)
            {
                if (aNode.getNext() != null)
                {
                    aNode = aNode.getNext();
                }
                else
                {
                    return null;
                }
            }

            if (aNode.getName() != nodeArray[nodeArray.length - 1] && aNode.getType() != 5 && aNode.getType() != 6)
            {
                aNode = aNode.getDirList()[0];
                depth++;
            }

            if (aNode != null && aNode.getName() == nodeArray[nodeArray.length - 1] && depth < nodeArray.length - 1)
            {
                var znode = 0;
                while (aNode.getDirEntry(znode).getName() != nodeArray[depth + 1] && depth <= nodeArray.length)
                {
                    if (aNode.getDirEntry(znode).getNext() != null)
                        znode++;
                    else
                        return null;
                }
                if (aNode.getDirEntry(znode).getName() == nodeArray[depth + 1])
                {
                    depth++;
                    aNode = aNode.getDirEntry(znode);
                }
                else
                    return null;
            }

	    switch(aNode != null) {
            	case aNode.getType() == 5:
                	if (aNode.getName() == nodeArray[depth])
                	    return (aNode);
			break;
            	case aNode.getType() == 4:
                	if (aNode.getName() == nodeArray[depth])
                    		return (aNode);
                	else
                	    return null;
			break;
            	case aNode.getType() == 6:
                	if (aNode.getName() == nodeArray[depth])
                    	return (aNode);
                	else
                    	return null;
			break;
	    }
        }
        return aNode;
    }
    this.watch = function(path, caller, callback)
    {
        var aNode = this.walk(path);
        return aNode.addWatcher(callback);
    }

    this.unwatch = function(callback, path, watcher)
    {
        var aNode = this.walk(path);
        return aNode.removeWatcher(callback, watcher);
    }

    this.log = function(text) 
    {
        stdLog = stdLog + "\n" + text;
    }
    
    this.mount = function(mode, fsTypeName, mountPoint, args)
    {
        var workPath = "/";
        var aNode;
        var pathArray = mountPoint.split('/');
        var counter = 0;
        var toMount = null;

        while (counter <= pathArray.length - 2)
        {
            if (workPath == "/")
                workPath = workPath + pathArray[counter];
            else
                workPath = workPath + '/' + pathArray[counter];
            counter++;
        }

        counter = 0;
        aNode = this.walk(workPath);

        if(aNode == null){
            return -1;      
        }
        
        this.log("loading from:");
        
        while (counter < vfsList.length-1 )
        {
            this.log(vfsList[counter].Name);
            counter++;
        }        
        
        counter = 0;
        //parse list of available filesystems for the one we've been asked to mount
        while (counter < vfsList.length-1 && vfsList[counter].Name != fsTypeName)
        {
            counter++;
        }

        if (aNode.getType() == 1 && vfsList[counter].Name == fsTypeName)
        {
            var count = 0;
            
            toMount = vfsList[counter];

            var newFile = new FileNode(pathArray[pathArray.length - 1], fileTypes.Mount);

            newFile.addParent(aNode);
            aNode.addChild(newFile);

            this.touched(aNode);
            newFile.setMount(toMount);
            return toMount.onmount(mountPoint,args);
       }
       else {
           console.printf("Mount failed"+ aNode.getType() + "== 1 && "  +  vfsList[counter].Name + " == " + fsTypeName);
           return null;
       }
    }

    this.tput = function(message)
    {
        //printf("you called tput()");
    }

    this.rput = function(message) { }

    this.tget = function(message) { }

    this.rget = function(message) { }

    this.tattch = function(message) { }

    this.rattach = function(message) { }

    this.tremove = function(message) { }

    this.fremove = function(message) { }

    this.tflush = function(message) { }

    this.rflush = function(message) { }
    
    return this;
}

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

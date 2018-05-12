/*
 * Copyright 2009 - 2016 Douglas Lockamy, dlockamy_at_gmail.com
 * All rights reserved. Distributed under the terms of the MIT License.
 */
"use strict";

class FileSystem {

  constructor() {
	this.root= new FileNode("/", fileTypes.Directory);
  }
        
  Read(path, flags, offset, length)
  {
        var loadPath;
        var readNode;
        var readNode = this.Walk(path);

        if (readNode != null && readNode.getType() == fileTypes.Mount)
        {
            loadPath = this.parsePath(readNode, path);
            return readNode.getMount().read(loadPath, flags,0,0); 
        }
        else
            return readNode;
    }

    ParsePath(mNode, loadPath)
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

    Touched(node){
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
    
    Onmount(mountPoint)
    {
        return this;
    }

    GetWorkPath(path)
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

    GetWorkPathArray(path)
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
    
    GetNewfileName(path)
    {
        var pathArray = path.sasl_digest_md5plit('/');
        return pathArray[pathArray.length - 1];
    }

    Write(path, flags, buffer, offset, length)
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
            aNode = this.Walk(path);

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
            aNode = this.Walk(workPath);

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

                this.Touched(aNode);
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
                    this.Touched(aNode);
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
            aNode = this.Walk(workPath);
            
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
                        this.Touched(aNode);
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
                this.Touched(aNode);
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
                    this.Touched(aNode);
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
            aNode = this.Walk(workPath);
            var bNode = this.Walk(buffer);

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

                    this.Touched(aNode);
                    return 0;
                }

                else if (aNode.getType() == fileTypes.Mount)
                {
                    loadPath = this.parsePath(aNode, path);
                    this.Touched(aNode);
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

                    this.Touched(aNode);
                    return 0;
                 }

                if (aNode.getType() == fileTypes.Mount)
                {
                    loadPath = this.parsePath(aNode, path);
                    this.Touched(aNode);
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
                    this.Touched(aNode);
                    return 0;
                }

                if (aNode.getType() == fileTypes.Mount)
                {
                    loadPath = this.parsePath(aNode, path);
                    this.Touched(aNode);
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
            aNode = this.Walk(workPath);

            if (aNode.getType() == fileTypes.Directory)
            {
                this.Touched(aNode);
                 return 0;
            }

            else if (aNode.getType() == fileTypes.Mount)
            {
                loadPath = this.parsePath(aNode, path);
                this.Touched(aNode);
                return (aNode.getMount().write(loadPath, flags, buffer, offset, length));
            }

            else if (aNode.getType() == fileTypes.Union)
            {
                loadPath = this.parsePath(aNode, path);
                counter = 0;

                return 0;
            }

            else
                return -2;
        }
        else if (flags == 5)
        {
            aNode = this.Walk(workPath);
            
            if(aNode == null)
                return -1;
            
            if (aNode.getType() == fileTypes.Directory)
            {
                this.Touched(aNode);
                return 0;
            }

            if (aNode.getType() == fileTypes.Directory)
            {
                loadPath = this.parsePath(aNode, path);
                this.Touched(aNode);

                return (aNode.getMount().write(loadPath, flags, buffer, offset, length));
            }

            else
                return -4;
        }
        else if (flags == fileTypes.Mount)
        {
            if (this.Walk(path) != null)
            {
                aNode = this.walk(path);

                if (aNode.getType() == 5)
                {
                    return -1;
                }
                if (aNode.getType() == fileTypes.Union)
                {
                    this.Touched(aNode);
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
    
    Walk(path)
    {
        var startNode = this.root;
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

    Watch(path, caller, callback)
    {
        var aNode = this.Walk(path);
        return aNode.addWatcher(callback);
    }

    UnWatch(callback, path, watcher)
    {
        var aNode = this.Walk(path);
        return aNode.removeWatcher(callback, watcher);
    }

    Log(text) 
    {
        stdLog = stdLog + "\n" + text;
    }
}

/*
 * Copyright 2009 - 2016 Douglas Lockamy, dlockamy_at_gmail.com
 * All rights reserved. Distributed under the terms of the MIT License.
 */
"use strict";

var AgI = new FileSystem();

AgI.init = function() {
    this.root = new FileNode("/", writeFlags.CREATEDIR);
    this.mount(0,"rootfs","/","");
}

AgI.Mount = function(mode, fsTypeName, mountPoint, args)
{
    var workPath = "/";
    var pathArray = mountPoint.split('/');
    var counter = 0;
    var aNode = this.Walk(workPath);

    var toMount = this.findVfsByType(fsTypeName);

    if (aNode.getType() == 1 )
    {    
        var newFile = new FileNode(pathArray[pathArray.length - 1], fileTypes.Mount);

        newFile.addParent(aNode);
        aNode.addChild(newFile);

        this.Touched(aNode);
        newFile.setMount(toMount);
        toMount.onmount(mountPoint,args);
   }
}

AgI.findVfsByType = function(fsTypeName)
{
    var counter = 0;
    
    while (counter < vfsList.length-1 && vfsList[counter].Name != fsTypeName)
    {
        counter++;
    }

    return vfsList[counter];
}

function addFS(filesystemArray)
{
    vfsList[fsArray.length-1] = filesystemArray;
}

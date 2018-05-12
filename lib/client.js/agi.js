/*
 * Copyright 2009 - 2016 Douglas Lockamy, dlockamy_at_gmail.com
 * All rights reserved. Distributed under the terms of the MIT License.
 */
"use strict";

class AgI extends FileSystem {
    init() {
        this.root = new FileNode("/", writeFlags.CREATEDIR);
        this.mount(0,"rootfs","/","");
    }
    
    Mount(mode, fsTypeName, mountPoint, args) {
        var workPath = this.findParentFromPath(mountPoint);
        var pathArray = mountPoint.split('/');
        var counter = 0;

        alert(mountPoint + "  |  "  +workPath);

        var aNode = this.Walk(workPath);
    
        var toMount = this.findVfsByType(fsTypeName);
    
        if (aNode.getType() == fileTypes.Directory )
        {    
            aNode.AddNewChild(pathArray[pathArray.length - 1], fileTypes.Mount, toMount);
            this.Touched(aNode);
            toMount.onmount(mountPoint,args);
       }
    }
    
    findParentFromPath(parentPathString) {

        if(parentPathString === '/')
            return '/';

        var pathArray = parentPathString.split('/');
        var retString = "";
        var count = 0;

        while( count <= pathArray.length - 2){
            if(count > 0 && pathArray[count] != '/'  ){
                retString = retString + '/' + pathArray[count];
            }

            count++;
        }

        return retString;
    }

    findVfsByType(fsTypeName) {
        var counter = 0;
    
        while (counter < vfsList.length-1 && vfsList[counter].Name != fsTypeName)
        {
            counter++;
        }
    
        return vfsList[counter];
    }

}



function addFS(filesystemArray)
{
    vfsList[fsArray.length-1] = filesystemArray;
}

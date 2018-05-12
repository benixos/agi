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

function addFS(filesystemArray)
{
    vfsList[fsArray.length-1] = filesystemArray;
}

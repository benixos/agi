/*
 * Copyright 2009 - 2016 Douglas Lockamy, dlockamy_at_gmail.com
 * All rights reserved. Distributed under the terms of the MIT License.
 */
"use strict";

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
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
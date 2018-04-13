/*
 * Copyright 2009 - 2016 Douglas Lockamy, dlockamy_at_gmail.com
 * All rights reserved. Distributed under the terms of the MIT License.
 */
"use strict";

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
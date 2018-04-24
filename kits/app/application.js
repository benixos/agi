/*
 * Copyright 2009-2018 Douglas Lockamy, dlockamy_at_gmail.com
 * All rights reserved. Distributed under the terms of the MIT License.
 */

var Application = [];

Application = function(name, mime) {
    this.myName = name;
    this.myMIME = mime;
    this.prototype = {};

    this.prototype.Quit = function() {
	return 0;
    };

    this.prototype.Run = function() {
	return 0;
    };

    this.prototype.Pulse = function() {
	return 0;
    };

    this.prototype.MessageReceived = function() {
	return 0;
    };


    this.Quit = function() {
	return this.prototype.Quit();
    };

    this.Run = function() {
	return this.prototype.Run();
    };

    this.Pulse = function() {
	return this.prototype.Pulse();
    };

    this.MessageReceived = function() {
	return this.prototype.MessageReceived();
    };
};
"use strict";
var TerminalApp = {};

var cmdParts = 0;
var TerminalApp = new peyote.Application("terminal", "application/x-vnd.AgI.Terminal");
var TerminalAppBanner = "facade.js development enviroment";
var TerminalAppWelcome = "Type \'help' followed by the enter key for a list of commands";
TerminalApp.appName = "TerminalApp";
TerminalApp.version = "0.0.1";
TerminalApp.currentDirectory = "/";
TerminalApp.TerminalAppDiv = 0;
TerminalApp.form = "";
TerminalApp.currentLine = "";
TerminalApp.running = 0;

TerminalApp.buffer = "";
TerminalApp.currentLine = "";

TerminalApp.init = function()
{
    var bFrame = new Frame(100,100,100,100);
    var aFrame = new Frame(0.0,99,99);
    var newView = new View(aFrame, "terminalScreen",0, 0 );

    var newWinFileName = "Terminal"+Date.now();
    agi.write("/local/dev/screen/new",2,newWinFileName);
    this.winID = agi.read("/local/dev/screen/"+newWinFileName, 0, 0);
    this.winID.fsReserved.mainView.style.backgroundColor = "#000000";
    this.winID.fsReserved.mainView.innerHTML = "hello world";
    this.winID.fsReserved.mainView.style.color = "#ffffff";
    this.winID.fsReserved.KeyDown = this.KeyDown;
    this.TerminalAppDiv = this.winID.fsReserved.mainView
    this.TerminalAppDiv.innerHTML = "comming soon"
    this.TerminalAppDiv.style.height = "400px";
    this.TerminalAppDiv.style.width = "580px";    
    this.TerminalAppDiv.style.overflow = "scroll";
    this.printf(TerminalAppBanner+"<br>"+TerminalAppWelcome+"<br>");

    var count = 0;
    
    count = 0;
     while(count < cmdList.length-1) {
        if( cmdList[count].appName === "shell"  ) {
            shell = cmdList[count];
            shell.main();
            break;
        }
         else
             count++;
    } 
};

TerminalApp.TerminalAppDiv = 0;

TerminalApp.printf = function(string)
{    
    bufferfile.data = bufferfile.data + string;
    this.TerminalAppDiv.innerHTML = bufferfile.data;
};

TerminalApp.cmd = function(line) {
 cmdParts = line.split(" ");

 this.printf("<br>");
 
 if(cmdParts[0] == "help")
 {
     if(cmdParts.length ==1)
     {
         printf("Available commands:<br>");
         var count = 0;
         while(count < cmdList.length)
         {
             printf(cmdList[count].appName+"<br>");
             count++;
         }
     }
     else
     {
         var count = 0;
         
         while(count < cmdList.length)
         {
             if(cmdList[count].appName == cmdParts[1])
             {
                 printf(cmdList[count].appName+"  ");
                 printf(cmdList[count].form+"<br>");
                 
                 break;
             }
             else
                 count++;
         };
         
     }
 }
 else if(cmdParts[0] == "cls" || cmdParts[0] == "clear")
 {
     this.buffer = "<br><br>";
     clearIO("stdOut");
     return;
 }
 else if(cmdParts[0] == "echo")
 {
     printf(cmdParts[1]);
     return;
 }
 else if(cmdParts[0] == "set")
 {
     this.printf("setting "+cmdParts[1] +" to "+ cmdParts[2] + "<br>");
 }
 else
 {
     var count = 0;
     
     while(count < cmdList.length)
     {
         if(cmdList[count].appName == cmdParts[0])
         {
             cmdList[count].main(cmdParts,line);
             return;
         };
         count++;
     }
 
     printf("Command not found<br>");
 }
};

TerminalApp.main = function(args)
{
    this.running = 1;
    this.printf(" $ " );
};

var terminalView = function(frame) {
     this.prototype = new View(frame, "terminal", "", "");

     this.Draw = this.prototype.Draw();
     this.Show = this.prototype.Show();

};


//var TerminalApp = new peyote.Application("terminal", "application/x-vnd.AgI.Terminal");

TerminalApp.window = 0;

/*
TerminalApp.Quit = function() {
		return 0;
    	};
*/

var CurrentTerminalApp = 0;

var currentTerm = 0;

TerminalApp.KeyDown = function(event) {
    currentTerm = this;

    var keyCode = event.keyCode;

    if(keyCode == 13)
    {
        CurrentTerminalApp.buffer = CurrentTerminalApp.buffer + "<br>";
        CurrentTerminalApp.cmd(CurrentTerminalApp.currentLine);
        CurrentTerminalApp.printf(" $ ");
        CurrentTerminalApp.currentLine = "";
        return;
    }
    else if(keyCode === 8) {
        CurrentTerminalApp.currentLine = CurrentTerminalApp.currentLine.substring(0, CurrentTerminalApp.currentLine.length-1);
        CurrentTerminalApp.buffer = CurrentTerminalApp.buffer.substring(0, CurrentTerminalApp.buffer.length-1);  
        CurrentTerminalApp.TerminalAppDiv.innerHTML = CurrentTerminalApp.buffer;
    }
    else
    {
        CurrentTerminalApp.printf(String.fromCharCode(keyCode) );
        CurrentTerminalApp.currentLine = CurrentTerminalApp.currentLine + String.fromCharCode(keyCode);
    }
}

TerminalApp.Run = function() {

    this.init();

     CurrentTerminalApp = this;

     //this.window.Show();

     return 0;
};
/*
TerminalApp.Pulse = function() {
		return 0;
    	};

TerminalApp.MessageReceived = function() {
	return 0;
    };
*/


var terminalMain = function() {
     TerminalApp.Run();
};

terminalMain();

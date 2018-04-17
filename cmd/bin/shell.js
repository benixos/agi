"use strict";
var shell = {};

var cmdParts = 0;

shell.appName = "shell";
shell.version = "0.0.1";
shell.currentDirectory = "/";
shell.consoleDiv = 0;
shell.form = "";
shell.currentLine = "";
shell.running = 0;
shell.input = function(keyCode)
{
    if(keyCode == 13)
    {
        shell.buffer = console.buffer + "<br>";
        shell.cmd(shell.currentLine);
        console.printf(" $ ");
        shell.currentLine = "";
        return;
    }
    else if(keyCode === 8) {
        shell.currentLine = shell.currentLine.substring(0, shell.currentLine.length-1);
        console.buffer = console.buffer.substring(0, console.buffer.length-1);  
        consoleDiv.innerHTML = console.buffer;
    }
    else
    {
        console.printf(String.fromCharCode(keyCode) );
        shell.currentLine = shell.currentLine + String.fromCharCode(keyCode);
    }
};

var printf = console.printf;

shell.cmd = function(line)
{
 cmdParts = line.split(" ");

 console.printf("<br>");
 
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
     console.buffer = "<br><br>";
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
     console.printf("setting "+cmdParts[1] +" to "+ cmdParts[2] + "<br>");
 } else if(cmdParts[0] == "windump")
 {
	windowTable.dump();
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
 
     console.printf("Command not found<br>");
 }
};

shell.main = function(args)
{
    shell.running = 1;
    console.printf(" $ " );
};

shell.exec = shell.main;

cmdList[cmdList.length] = shell;



var consoleDiv;
var UserName = "";
var currentDir = "/home/";
var console = {};
var loginAttempt = 0;
var isLogin = 0;
var consoleVersion = "0.3";
var consoleBanner = "AgI Console. ver"+consoleVersion;
var consoleWelcome = "Welcome! Type \"help\" for commands";
var shell = 0;
console.buffer = "";
console.currentLine = "";

console.init = function()
{
    isLogin = 1;
    if(document.getElementById("cmd") !== undefined) {
        consoleDiv = document.getElementById("cmd");
    } else {
        consoleDiv = 0;
    }
    console.printf(consoleBanner+"<br>"+consoleWelcome+"<br>");
 
    var count = 0;

    while(count < cmdList.length-1) {
        agi.Write("/bin/"+cmdList[count].appName,5,cmdList[count]);   
        count++;
    }
    
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

console.input = function(keyCode)
{
    if(shell.running)
    {
        shell.input(keyCode);
    }
    else if(keyCode == 13)
    {
        console.buffer = console.buffer + "<br>";
        return;
    }
    else
    {
        console.printf(String.fromCharCode(keyCode) );
        console.currentLine = console.currentLine + String.fromCharCode(keyCode);
    }
};

console.printf = function(string)
{
    console.buffer = console.buffer + string;
    bufferfile.data = bufferfile.data + string;
    stdOut = stdOut + consoleDiv;
    consoleDiv.innerHTML = console.buffer;
};

boot = function() {     
 agi.init();
 console.init();   

 if(typeof main === "undefined")
	alert("You must define main() to use AgI");
 else
	main();
}

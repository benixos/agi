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
	    consoleDiv = document.getElementById("cmd");

	    console.printf(consoleBanner+"<br>"+consoleWelcome+"<br>");
	 
	    var count = 0;

	    while(count < cmdList.length-1) {
		            agi.write("/bin/"+cmdList[count].appName,5,cmdList[count]);   
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
	    stdOut = stdOut + consoleDiv;
	    
	    bufferfile.data = bufferfile.data + string;
	        
	    if(consoleDiv !== 0) {
		            consoleDiv.innerHTML = console.buffer;
		        }
};

console.toggle = function() {
};

printf = console.printf;

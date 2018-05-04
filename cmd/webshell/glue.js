var consoleDiv;
var UserName = "Dave";
var currentDir = "/users/"+UserName;
var console = {};
var cmdList = [];

var loginAttempt = 0;
var isLogin = 0;
var consoleVersion = "0.2";
var consoleBanner = "DSCMS Console. ver"+consoleVersion+"<br>";
var consoleWelcome = "<br>Welcome "+UserName+"<br>Type \"help\" for commands";

var helpList = "Available commands:<br>login <i>$username</i><br>clear<br>help<br>exit<br>set <i>variable</i> <i>value</i><br>";
helpList = helpList + "read <i>filepath</i><br>write <i>filepath</i> <i>data</i><br>ioctl <i>filepath</i> <i>command</i><br>";
helpList = helpList + "ls helplist <i>filepath</i><br>cd <i>path</i><br>";

var login = {};
login.init = function()
{
    consoleDiv = document.getElementById("cmd");
    consoleDiv.innerHTML = "";
    if(loginAttempt < 3)
    {
        console.printf(consoleBanner);
        console.printf("Username:");
        loginAttempt = loginAttempt + 1;
    }
    else
    {
        console.printf("You've struck out");
    }
};

login.step = 0;
login.username = "";
login.password = "";

login.input = function(keyCode)
{
    if(keyCode == 13)
    {
        console.buffer = console.buffer + "<br>";
        
        if(login.step === 0)
        {
            login.username = console.currentLine;
            login.step++;        }
        else if(login.step == 1)
        {
            console.printf("Password: ");
            login.step++;
        }
        else
        {
            console.printf("Logging on.....");
            login.step = 0;
            agi.login(login.username, login.password);
        }

        console.currentLine = "";
        
        return;
    }
    else
    {
        console.printf(String.fromCharCode(keyCode) );
        login.password = login.password + String.fromCharCode(keyCode);
        console.currentLine = console.currentLine + String.fromCharCode(keyCode);
    }
};
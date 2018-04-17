var login = {};

login.appName = "login";
login.version = "0.0.1";

login.consoleDiv = 0;
login.form = "<i>username</i> <i>password</i> ";
login.currentLine = "";

login.main = function(args)
{

    if( args[1] != "undefined" || args[2] != "undefined" || args[3] != "undefined") {
        console.printf("login:" +  args[1] + " " + args[2] + " " + args[3] + "<br>");
        agi.login(args[1], args[2], args[3]);
    }
    else
        console.printf(login.form + "<br>");
    
};

login.call = function(user,pass) {
    //agi.mount(0,"xmppfs", "/dev/message",user, pass,0); 
    console.printf("login.call()");
    console.printf(agi.login("#xmpp:softsurve.com:5280", user, pass));
}

login.exec = login.main;

cmdList[cmdList.length] = login;


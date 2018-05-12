var exec = {};

exec.appName = "exec";
exec.version = "0.0.1";

exec.consoleDiv = 0;
exec.form = "<i>filename</i>";
exec.currentLine = "";

exec.main = function(arg)
{
    var path = "";
    var fileData=0;

    buffer = agi.Read(arg[1],0,0,0);

    if(buffer.Type === 2) {
	eval(buffer.getData());
    }
    else
        console.printf("Not a Character File<br>");
};

exec.exec = exec.main;

cmdList[cmdList.length] = exec;

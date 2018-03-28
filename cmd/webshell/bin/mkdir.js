var mkdir = {};

mkdir.appName = "mkdir";
mkdir.version = "0.0.1";

mkdir.consoleDiv = 0;
mkdir.form = "";
mkdir.currentLine = "";

mkdir.main = function(arg)
{
    agi.write(arg[1],1,1);

};

mkdir.exec = mkdir.main;

cmdList[cmdList.length] = mkdir;


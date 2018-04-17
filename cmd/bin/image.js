var image = {};

image.appName = "image";
image.version = "0.0.1";

image.consoleDiv = 0;
image.form = "<i>image/path</i>";;
image.currentLine = "";

image.main = function(arg, line)
{
    buffer = agi.read(arg[1],0,0,0);
    //if(buffer.Type === fileTypes.Binary)
        console.printf("<img src=\"data:image/png;base64,"+buffer.Data+"\"/><br>");
    //else
    //    console.printf("File is not an image");
};

image.open = function(path)
{
    buffer = agi.read(path,0,0,0);
    var winID = agi.write("/dev/win/new",2,"ImageViewer");
    var winView = document.getElementById(winID+"_mainView");
    if(buffer.Type === 3)
        winView.innerHTML = "<img src=\"data:image/png;base64,"+buffer.Data+"\"/><br>";
    else
        console.printf("File is not an image<br>");
};

image.exec = image.main;

cmdList[cmdList.length] = image;


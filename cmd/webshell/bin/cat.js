var cat = {};

cat.appName = "cat";
cat.version = "0.0.1";

cat.consoleDiv = 0;
cat.form = "<i>filename</i>";
cat.currentLine = "";

cat.main = function(arg)
{
    var path = "";
    var fileData=0;

    buffer = agi.read(arg[1],0,0,0);

    if(buffer.Type === 2)
        console.printf(buffer.data+"<br>");
    else
        console.printf("Not a Character File<br>");
};

cat.exec = cat.main;

cmdList[cmdList.length] = cat;
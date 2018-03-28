var write = {};

write.appName = "write";
write.version = "0.0.1";

write.consoleDiv = 0;
write.form = "<i>new filename</i> <i>new file contents</i>";
write.currentLine = "";

write.main = function(arg, line)
{
    var args = line.split(" ");
    var path = "";
    var fileData=0;

    agi.write(arg[1],2,arg[2]);
};

write.exec = write.main;

cmdList[cmdList.length] = write;


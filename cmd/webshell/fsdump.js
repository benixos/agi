var fsdump = {};

fsdump.appName = "fsdump";
fsdump.version = "0.0.1";

fsdump.consoleDiv = 0;
fsdump.form = "<i>filename</i>";;
fsdump.currentLine = "";

fsdump.main = function(arg)
{
        var dumpNode = 0;
        
        if(arg === "")
            dumpNode = rootfs;
        else
            dumpNode = agi.Walk(arg[1]);
  
        console.printf(dumpNode+"<br>");
        console.printf("Name: "+dumpNode.Name+"<br>");
        console.printf("Type: "+dumpNode.Type+"<br>");
        console.printf("prev: "+dumpNode.prev+"<br>");
        console.printf("next: "+dumpNode.next+"<br>");
        console.printf("Data: "+dumpNode.Data+"<br>");
        console.printf("Meta: "+dumpNode.meta+"<br>");
        console.printf("Watchers: "+dumpNode.watchers+"<br>");
        if(arg[1] != "/")
            console.printf("Parent: "+dumpNode.Parent.Name+"<br>");
};

fsdump.exec = fsdump.main;

cmdList[cmdList.length] = fsdump;

var fslist = {};

fslist.appName = "fslist";
fslist.version = "0.0.1";

fslist.consoleDiv = 0;
fslist.form = "";;
fslist.currentLine = "";

fslist.main = function(arg)
{
    var counter = 0;
    
    //parse list of available filesystems for the one we've been asked to mount
    while(counter < vfsList.length ) { 
        console.printf(vfsList[counter].Name+"<br>");
        counter++;
    }
};

fslist.exec = fsdump.main;

cmdList[cmdList.length] = fslist;

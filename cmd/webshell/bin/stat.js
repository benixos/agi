var stat = {};

stat.appName = "stat";
stat.version = "0.0.1";

stat.consoleDiv = 0;
stat.form = "usage:<br>stat <i>path</i><br>";
stat.currentLine = "";

stat.main = function(args)
{
    if(args == null)
    {
        printf(stat.form);
        return;
    };
    
    printf( vfs.stat(args) );
};

stat.exec = stat.main;

cmdList[cmdList.length] = stat;


var ls = {};

ls.appName = "ls";
ls.version = "0.0.1";

ls.consoleDiv = 0;
ls.form = "usage:<br>list <i>path</i><br>";
ls.currentLine = "<i>directory</i>";;

ls.main = function(arg)
{
    if(arg === null | arg === undefined | arg.length < 2)
    {
        printf(ls.form);
        return;
    }

    buffer = agi.Read(arg[1],0,0,0);
    
    var count = 0;

    if( buffer != null && buffer.Type == 1){ 
        if(buffer.getDirList().length === 0)
            console.printf("Empty Diretory<br>");

         while(count < buffer.getDirList().length) {

	    if(buffer.getDirList()[count].getName() != "") {	
		if(buffer.getDirList()[count].Type == 1)
                   console.printf("<b style=\"color:blue\">");
		else if(buffer.getDirList()[count].getType() == 2 || buffer.getDirList()[count].getType() == 3)
                   console.printf("<b style=\"color:cyan\">");                   
		else if(buffer.getDirList()[count].getType() == 4)
                   console.printf("<b style=\"color:red\">");  
		else if(buffer.getDirList()[count].getType() == 5 || buffer.getDirList()[count].getType() == 6)
                   console.printf("<b style=\"color:green\">");                   
                
		console.printf(buffer.getDirList()[count].getName());
                console.printf("</b><br>");
	    }
                count++;
         }
    }
    else
        console.printf("File "+arg[1]+" is not a directory<br>");
};

ls.exec = ls.main;

cmdList[cmdList.length] = ls;


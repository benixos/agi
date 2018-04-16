/*
 * Copyright 2009 - 2015 Douglas Lockamy, dlockamy_at_gmail.com
 * All rights reserved. Distributed under the terms of the MIT License.
 */
"use strict";

if(!debug)
    var debug = 0;

var windowKill = function( windowID )
{
    var thisNode = document.getElementById(windowID.id);
    thisNode = thisNode.parentNode;
    thisNode.parentNode.removeChild(thisNode);
};

var windowHide = function( windowID )
{
    var thisNode = document.getElementById(windowID.id);
    //thisNode = thisNode.parentNode;
    thisNode.parentNode.style.visibility="hidden";
};

var srvWindow = function(frame,title,type,flags,screen)
{
    this.dragDown = 0;
    this.AVOID_FRONT = 0;

	if(checkFlags(flags,"NO_TITLE"))
		this.TITLED_WINDOW = 0;
	else
		this.TITLED_WINDOW = 1;
    this.mainView = 0;
	this.name = title;
    var d = new Date();
    this.myName = title+d.getTime(); 
    this.newWindow = document.createElement('div');
    this.newWindow.id = this.myName ;
    this.newWindow.name = title;
    //this.newWindow.class = "WKWindow";
	this.end = 0;
//default window style
    this.newWindow.style.position = "absolute"; 
    this.newWindow.style.overflow = "hidden";   
    this.newWindow.style.left = frame.x+"px";
    this.newWindow.style.top = frame.y+"px";
    this.newWindow.style.width = frame.width+"px";
    this.newWindow.style.height = frame.height+25+"px";    
    this.newWindow.style.color = "white";
    this.newWindow.style.backgroundColor = defaultViewColor;
    this.newWindow.style.visibility="hidden";
    this.newWindow.style.border = "inset red 4px";
    this.newWindow.style.borderColor = "black" ;    
    this.newWindow.style.borderWidth = "1px 1px";
    this.newWindow.style.borderRadius= "10px 5px";    

    this.addChild = function(aView){
        if(aView.div)
            this.mainView.appendChild(aView.div);
        else if(aView.prototype)
            this.mainView.appendChild(aView.prototype.div);
        else
            return -1;
    };

    this.Show = function(){
    };

    this.getName = function() {
        return this.myName;
    }
};

/*
* Filesystem API starts here
*/

var ctlfile = 0;
var newfile = 0;
var winfile = 0;
var winDir = 0;

var windowFS = new fileSystem();
windowFS.Name = "winfs"; //This is what the user mounts you as
windowFS.winList = [];

windowFS.createWindowNode = function(name) {
    xStartPoint = xStartPoint + 50;
    yStartPoint = yStartPoint + 50;
	var frame1 = new Frame(xStartPoint,yStartPoint, 400 , 600);
	    
    newfile = new FileNode(name,fileTypes.Binary);
    newfile.putData(new Window(frame1,name,"fatty",0,0));
    newfile.addParent(this.root);
    this.root.addChild(newfile);
    
    this.winList[this.winList.length] = newfile;
    this.winList[this.winList.length-1].getData().Show();
    
    return newfile.Name;
};

windowFS.createWindowNodeFromDiv = function(div) {
    xStartPoint = xStartPoint + 50;
    yStartPoint = yStartPoint + 50;
	var frame1 = new Frame(xStartPoint,yStartPoint, 400 , 600);
	    
    newfile = new FileNode(div,fileTypes.Binary);
    newfile.putData(new Window(frame1,div,"fatty",0,0));
    newfile.addParent(this.root);
    this.root.addChild(newfile);
    
    this.winList[this.winList.length] = newfile;
    //this.winList[this.winList.length-1].getData().Show();
    //this.winList[this.winList.length-1].getData().mainView.appendChild(document.getElementById(div));

    return newfile.Name;
};

windowFS.pathIsWindowName = function(name) {
    var winCounter = 0;
    if( name.charAt( 0 ) === '/' )
        name = name.slice( 1 );
    
    while(winCounter < this.winList.length && this.winList[winCounter].Name != name) {      
        winCounter++;
    }
    
    if(this.winList[winCounter].getName === name)
        return this.winList[winCounter];
    else
        return false;
};

windowFS.read = function(path,flags,offset,length) {    
    var loadPath;
    var readNode;

    if(flags == '0') {
        if(path === "/ctl") {
            var simpleNode = this.walk("/ctl");
            
            simpleNode.putData( winConfig.toString());  
            return simpleNode;
        }
        else if(path === "/new") {
            return "ERROR_WRITE_ONLY";           
        }
        else if(path === "/" || path === "") {
            return this.root;
        }
        else if(this.pathIsWindowName(path) != false ) {
            var count = 0;
            
            while(winCounter < this.winList.length && this.winList[winCounter].Name != name) {      
                winCounter++;
            }
    
            if(this.winList[winCounter].myName === name) {
                var simpleNode = this.winList[winCounter];  
                return simpleNode;
            }
            else
                return "ERROR_FILE_NOT_FOUND";;
        }
        else
            return "ERROR_FILE_NOT_FOUND";
    }
    if(flags =='1')
    {
        if(path == "/new" || path == "/ctl")
            return 2;
        else if(path == "/win")
            return 1;
        else
            return "Error: Read 1";
    }
    else if(flags =='2')
    {    
        if(this.pathIsWindowName(path) != false ) {
            var count = 0;
            
            while(winCounter < this.winList.length && this.winList[winCounter].Name != name) {      
                winCounter++;
            }
    
            if(this.winList[winCounter].myName === name) {
                var simpleNode = this.winList[winCounter];  
                return simpleNode;
        } else
            return "ERROR_NOT_A_DIR";
    }
    }
    else if(flags == '3') {         
        if(path === "/ctl") {
            var simpleNode = ctlfile ;
            simpleNode.Data = winConfig.toString();  
            return simpleNode;
        }
        else if(path === "/new") {
            return "ERROR_WRITE_ONLY";           
        }
    }
    else
        return "ERRORO_INVALID_READ_REQUEST";
};

windowFS.write = function(path,flags,buffer,offset,length) {
        if(path === "/ctl")
            return "READ_ONLY";
        else if(path === "/new") {
            var buffer = this.createWindowNode(buffer);

//stupid hack until fs watchers are properly implemented
screenFS.onWatched(buffer);

            return buffer;	
	}
        else if(path === "/")
            return "READ_ONLY";
	else if(this.pathIsWindowName(path.split("/")[0] == true )  ) {
alert(path.split("/")[0]);
//stupid hack until fs watchers are properly implemented
//screenFS.onWatched(buffer);
	}
        else
            return "ERROR_FILE_NOT_FOUND";
};

windowFS.init = function() {
    this.root = new FileNode("/", fileTypes.Directory);
    ctlfile = new FileNode("ctl", fileTypes.Text);
    newfile = new FileNode("new", fileTypes.Text);

    this.root.addChild(ctlfile);
    this.root.addChild(newfile);
/*
    if(document.getElementById("log") ) {
        var facadeWin = this.createWindowNodeFromDiv("log");
    };
   
    if(document.getElementById("cmd") ) {
        var benixWin = this.createWindowNodeFromDiv("cmd");  
    };   */
};

windowFS.onmount = function(mountPoint)
{
    windowFS.init();
};

windowFS.umount = function(mountPoint)
{

};

//Add this filesystem to AgI's FS list so it can be mounted
vfsList[vfsList.length] = windowFS;


/*
 * Copyright 2009 - 2015 Douglas Lockamy, dlockamy_at_gmail.com
 * All rights reserved. Distributed under the terms of the MIT License.
 */
"use strict";

if(!debug)
    var debug = 0;

if (typeof document === "undefined") {
   var document;
}

var windowEntry = function(myOwner, myWin) {
	this.owner = myOwner;
	this.winID = myWin;
}

var winTable = [];

var windowTableClass = function() {
	this.addEntry = function(owner, win) {
		winTable[winTable.length] = new windowEntry(owner, win);
	}

	this.findEntryByWinId = function(winID) {
		var count = 0
  
		while(count < winTable.length) {
			if(winTable[count].winID == winID) {
				return winTable[count];
			} 
        
			count++;
		}
		return -1;
	}

	this.findEntryByOwnerId = function() {
	}

	this.dump = function() {
		var count = 0;

	     while(count <= winTable.length - 1) {
		//printf("winTable: owner="+winTable[count].owner + " winID=" + winTable[count].winID);
		count++;
	     }
	}
}

var windowTable = new windowTableClass();

var Window = function(frame, title, type, flags, screen) {
     this.name =agi.write("/local/dev/screen/local/new", 2, title);
     //this.name = title;
     var afileNode = agi.read("/local/dev/screen/local/"+title, 0, 0);
     this.prototype = afileNode.fsReserved; //.getData();
     this.prototype.mainView.innerHTML = "hello world";

     windowTable.addEntry(this, this.name);

     this.AddChild = function(aView) {

     };

     this.Show = function() {
	//this.prototype.Show();
     }

     this.KeyDown = function(event) {
	//printf("input event received");
     }

};

var View = function(frame, name, resizingMode, flags) {
     this.prototype = "";
     this.parentPath = "";
     this.name = name;
     this.AttachedToWindow = function() {
	agi.Write(this.parentPath+"/" + name, 0, name)
	var tempNode = agi.Read(this.parentPath+"/"+name,0,0);
	this.prototype = tempNode.getData();
     };

     this.Draw = function() {
	this.prototype.Draw();
     };

     this.Keydown = function(bytes, numBytes) {
	this.KeyDown(bytes, numBytes);
     };

     this.KeyUp = function(bytes, numBytes) {
	this.KeyUp(bytes, numBytes);
     };

     this.MessageReceived = function(message) {

     };

     this.MouseDown = function() {

     };

     this.MouseMoved = function() {

     };

     this.MouseUp = function() {

     };

     this.TouchDown = function() {

     };

     this.TouchUp = function() {

     };

     this.Swipe = function() {

     };

     this.Pulse = function() {

     };

     this.WindowActivated = function() {

     };

     this.AddChild = function(aView) {
	this.prototype.AddChild(aView);
     };

     this.RemoveChild = function(aView) {
	this.prototype.RemoveChild(aView);
     };

     this.SetParent = function(path) {
	this.parentPath = path;
	this.AttachedToWindow();
     };

}

//Default colors as set by Default Theme. If not using defualt theme, set colors here
var mainBackgroundColor = "#000000";
var mainViewColor =  "#898989";
var defaultclientWindowBarColor = "#4444ff";
var defaultclientWindowMuteBarColor = "#444457";
var defaultViewColor = "#a9a9a9";

var xStartPoint = 50;
var yStartPoint = 50;

var xShift = 0;
var yShift = 0;

var isDragging = 0;
var topclientWindow = 0;

var draggingX = 0;
var draggingY = 0;

var mouseDownX = 0;
var mouseDownY = 0;
var topclientWindow = 0;

var windowDown = function(windowID,e)
{       
    if(e.target.id.indexOf("_TitleBar") > -1  ){
       isDragging = 1;
                
	   if(topclientWindow === 0){
 	      topclientWindow = windowID.parentNode;
        } else {
            topclientWindow.style.backgroundColor = defaultclientWindowMuteBarColor; 
            topclientWindow.parentNode.style.zIndex = "10";
            //alert(topclientWindow.id + " + " + windowID.parentNode.id);
            topclientWindow = windowID;//windowID.parentNode;//
	   }
        windowID.style.backgroundColor = defaultclientWindowBarColor;
        windowID.parentNode.style.zIndex = "100";

        mouseDownX = e.pageX;
        mouseDownY = e.pageY;
   
        xShift = mouseDownX - topclientWindow.style.left;
        yShift = mouseDownY - topclientWindow.style.top;
        return 1;
    } else {
        //alert(topclientWindow.id + " + " + windowID.id);
        return 0;
    }
};

var windowMove = function(e)
{
   if(isDragging == 1 )
   {     
        var currentX = e.pageX;
        var currentY = e.pageY;       
        var windowBar = topclientWindow.parentNode;       
        var changeX = currentX - mouseDownX;
        var changeY = currentY - mouseDownY;
 
        var newX = parseInt(windowBar.style.left) + changeX;
        var newY = parseInt(windowBar.style.top) + changeY;
  
        if(newX > 0 && newY > 0 && newX < 980 && newY < 780)
        {   
            windowBar.style.left = newX+"px";
            windowBar.style.top = newY+"px";
        }
       mouseDownX = e.pageX; 
       mouseDownY = e.pageY;
       return 1;
   }
   else
        return 0;
};

var windowUp = function()
{
    isDragging = 0;
};

var windowStartDrag = function() {
    console.printf("start drag<br>");
      isDragging = 1;  
    return 0;
};

var windowDragEnd = function() {
      isDragging = 0;
    return 0;
};

var Screen = function(type)
{
    this.height;
    this.width;

    this.init = function() {

    }	
	
    this.getWidth = function() {
		return this.width;
    };
	
    this.setFont = function() {	
    };

    this.getFontSize = function(){
		
    }
}; 

var CGA = new Screen(320,200);
var QVGA = new Screen(320,240);
var WVGA = new Screen(640,480);
var WSVGA = new Screen(1024,600);
var PAL = new Screen(720,576);
var SVGA = new Screen(800,600);
var XGA = new Screen(1024,768);
var WXGA = new Screen(1280,720);
var HD = new Screen(1920,1080);

var Frame = function(x,y,h,w) {
    this.x = x;
    this.y = y;
    this.height = h;
    this.width = w;
};

var Rect = function(x1,y1,h,w) {
    this.x = x1;
    this.y = y1;
    this.height = h;
    this.width = w;
};

var Point = function(x,y) {
    this.x = x;
    this.y = y;
};

var Shape = function() {
 
};

var Polygon = function() {

};

var checkFlags = function(flags,string)
{
	if(flags == "NO_TITLE")
		return 1;
	return 0;
};

var windowKill = function( windowID )
{
	var thisNode = document.getElementById(windowID.id);
    thisNode = thisNode.parentNode;
	thisNode.parentNode.removeChild(thisNode);
};

var clientWindow = function(frame,title,type,flags,screen)
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

    this.myName = title;//+d.getTime();    
    this.newclientWindow = document.createElement('div');
    this.newclientWindow.id = this.myName ;
    this.newclientWindow.className = "window";
	this.end = 0;

    if(document.body.clientWidth >= 768) {
        this.newclientWindow.style.left = frame.x+"px";
        this.newclientWindow.style.top = frame.y+"px";
        this.newclientWindow.style.width = frame.width+"px";
        this.newclientWindow.style.height = frame.height+25+"px";    
    }
    if(this.TITLED_WINDOW && flags != "TRAY_VIEW" )
    {
        this.titleBar = document.createElement('div');
        this.titleBar.id = this.myName+"_TitleBar";
        this.titleBar.className = "titlebar";
        this.titleBar.innerHTML = "&nbsp  <span class=\"glyphicon glyphicon-remove-sign\" onclick=\"windowKill(this.parentNode)\"></span> "+
		"<span class=\"glyphicon glyphicon-minus-sign\" onclick=\"windowHide(this.parentNode)\"></span>  &nbsp&nbsp"+title;
        this.titleBar.draggable = "true";
        this.titleBar.ondragstart = windowStartDrag;
        this.titleBar.ondragend = windowDragEnd;
        this.titleBar.onselect = 0;
        
        this.newclientWindow.appendChild(this.titleBar);  
        this.mainView = document.createElement('div');
        this.mainView.id = this.myName+"_mainView";
        this.mainView.innerHTML = "";
        this.mainView.className = "view";
        this.newclientWindow.appendChild(this.mainView);
        this.newclientWindow.onselect = 0;
    }

    if(this.AVOID_FRONT)
        this.newclientWindow.style.zIndex = -2;    
    
    document.body.appendChild(this.newclientWindow);      

	this.Hide = function()
	{
        var childCount = this.newclientWindow.childNodes.length -1;
        var i = 0;
        while(i < childCount)
        {
            this.newclientWindow.childNodes[i].style.visibility = "hidden";
            i++;
        }
		this.newclientWindow.style.visibility="hidden";
	};
	
    this.move = function(x,y){
        this.newclientWindow.style.left = x+"px";
        this.newclientWindow.style.top = y+"px";
    };
    
    this.addChild = function(aView){
        if(aView.div)
            this.mainView.appendChild(aView.div);
        else if(aView.prototype)
            this.mainView.appendChild(aView.prototype.div);
        else
            return -1;
    };

    this.Show = function(){
        if(topclientWindow === 0){
 	      topclientWindow = this.newclientWindow;  
	       //topclientWindow.style.backgroundColor = defaultclientWindowBarColor;
            topclientWindow.parentNode.style.zIndex = "100";
            topclientWindow.style.visibility="visible"; 
        } else {
            //topclientWindow.style.backgroundColor = defaultclientWindowMuteBarColor; 
            topclientWindow.parentNode.style.zIndex = "10";
            topclientWindow = this.newclientWindow;
	       //topclientWindow.style.backgroundColor = defaultclientWindowBarColor;
            topclientWindow.parentNode.style.zIndex = "100";
            topclientWindow.style.visibility="visible"; 
	   }
    };
    this.getName = function() {
        return this.myName;
    }
    
    //this.newclientWindow
    windowTable.addEntry(this, this.name);
};

var clientView = function(frame,name,resizingMode,flags)
{
    if(!frame)
        return -1;

    var d = new Date();
    this.div = "";//newView;
    this.myName = name+d.getTime();
    this.myFrame = frame;

    this.newView = document.createElement('div');
    this.newView.id = this.myName ;
    this.newView.style.position = "absolute"; 
    this.newView.style.overflow = "hidden";   
    this.newView.style.left = this.myFrame.x+"px";
    this.newView.style.top = this.myFrame.y+"px";
    this.newView.style.bottom = this.myFrame.width+"px";
    this.newView.style.width = this.myFrame.width+"px";
    this.newView.style.height = this.myFrame.height+"px";
    this.newView.style.color = "white";
    this.newView.style.backgroundColor = "#809090";
    this.newView.style.visibility="hidden";
    this.newView.style.zIndex="0";

    this.getView = function()
    {       
        return this.newView;
    };
          
    this.getViewId = function()
    {       
        return this.newView.id;
    };
    
    this.setStyleValue = function(styleName,value)
    {
        if(this.newView)
          this.newView.setAttribute(styleName,value);     
    };

    this.addHTML = function(innerHTML)
    {
        var aView = document.getElementsByName(this.myName);
        if(this.newView)
            this.newView.innerHTML=innerHTML;
        else
            return -1;
    };
    
    this.addChild = function(aView)
    {
        if(newView)
            this.newView.appendChild(aView);    
        else
            return -1;    
    };
    
    this.AddChild = function(aview)
    {
        if(newView)
            this.newView.appendChild(aView);    
        else
            return -1;  
    };
    
    this.addChildDiv = function(aDiv)
    {
        if(newView)
            newView.appendChild(aDiv);    
        else
            return -1;
    };
    
    this.Show = function()
    {
        this.topclientWindow.style.backgroundColor = defaultclientWindowMuteBarColor; 
        this.topclientWindow.parentNode.style.zIndex = "10";
        this.topclientWindow = this.newView;
	    this.windowID.style.backgroundColor = defaultclientWindowBarColor;
        this.windowID.parentNode.style.zIndex = "100";
        this.newView.style.visibility="visible";    
    };

    this.Hide = function()
    {
        var childCount = this.newView.childNodes.length -1;
        var i = 0;
        while(i < childCount)
        {
            this.newView.childNodes[i].style.visibility = "hidden";
            i++;
        }
		this.newclientWindow.style.visibility="hidden";
        
        
        this.newView.style.visibility="hidden";    
    };

    this.SetHighColor = function(color)
    {
        this.newView.style.backgroundColor = color;
    };
};

var Animation = function(aView,animationType,lengthInSeconds,flags)
{
    isRunning = 0;
    this.stopping = 0;
    runTime = lengthInSeconds;
    this.frame = 0;
    timer = 0;
    effectType = animationType;
    frame = 0;
    isRunning = 0;
    endX = flags.x;
    endY = flags.y;
    
    viewCurrent = aView.Bounds();

    stepX = (viewCurrent.x - flags.x ) / lengthInSeconds;
    stepY =  (viewCurrent.y - flags.y) / lengthInSeconds;
    
    shrinkX = (viewCurrent.width - flags.width) / lengthInSeconds;
    shrinkY = (viewCurrent.height - flags.height) /lengthInSeconds; 
    
    this.tick = function()
    {
        if(isRunning && frame <= runTime )
        {
            frame++;
            if(effectType=="SHRINK")
            {
                aView.MoveBy(stepX,stepY);
                aView.ReSizeBy(shrinkX,shrinkY);   
            }
        }
        else
        {
            clearInterval(timer);
        }
    };

    this.Play = function()
    {
        if(!this.isRunning)
        {
            isRunning = 1;
            timer = setInterval(this.tick,20); 
        }  
    };
    
    this.Pause = function()
    {
         this.isRunning = false;   
    };
    
    this.Stop = function()
    {
        this.isRunning = false;
        this.stopping = true;
    };
};

/*
* Filesystem API starts here
*/

var ctlfile = 0;
var newfile = 0;
var localfile = 0;
var winfile = 0;
var winDir = 0;

var winConfig = {};
winConfig.mode = "Desktop";
winConfig.ScreenWidth = 0;
winConfig.ScreenHeight = 0;

var screenFS = new fileSystem();
screenFS.Name = "screenfs"; //This is what the user mounts you as
screenFS.winList = [];

screenFS.mode = "";
screenFS.width = 0;
screenFS.height = 0;

screenFS.createclientWindowNode = function(name) {
    xStartPoint = xStartPoint + 50;
    yStartPoint = yStartPoint + 50;
    var frame1 = new Frame(xStartPoint,yStartPoint, 400 , 600);
    var winName = new clientWindow(frame1,name,"fatty",0,0);	    

    newfile = new FileNode(name,fileTypes.Directory);
    newfile.fsReserved = winName;
    newfile.addParent(this.walk("local"));
    this.walk("local").addChild(newfile);
    
    this.winList[this.winList.length] = newfile;
    this.winList[this.winList.length-1].fsReserved.Show();
    
    return winName.myName;
};

screenFS.createclientViewNode = function(name, parentWindowName) {
    var frame1 = new Frame(0,0, 400 , 600);
    var winName = new clientView(frame1,name,0,0);	    

    newfile = new FileNode(name,fileTypes.Binary);
    var winName = newfile.putData(winName);
    newfile.addParent(this.walk("local/"+parentWindowName));
    this.walk("local/"+parentWindowName).addChild(newfile);
    
    this.winList[this.winList.length] = newfile;
    this.winList[this.winList.length-1].getData().Show();
    
    return winName.myName;
};

screenFS.createclientWindowNodeFromDiv = function(div) {
    xStartPoint = xStartPoint + 50;
    yStartPoint = yStartPoint + 50;
	var frame1 = new Frame(xStartPoint,yStartPoint, 400 , 600);
	    
    newfile = new FileNode(div,fileTypes.Binary);
    newfile.putData(new clientWindow(frame1,div,"fatty",0,0));
    newfile.addParent(this.root );
    this.root.addChild(newfile);
    
    this.winList[this.winList.length] = newfile;
    this.winList[this.winList.length-1].getData().Show();
    this.winList[this.winList.length-1].getData().mainView.appendChild(document.getElementById(div));

    return newfile.Name;
};

screenFS.pathIsclientWindowName = function(name) {
    var winCounter = 0;
    if( name.charAt( 0 ) === '/' )
        name = name.slice( 1 );
    
    while(winCounter < this.winList.length -1 && this.winList[winCounter].Name != name) {      
        winCounter++;
    }

    if(this.winList != null  && this.winList[winCounter].Name === name)
        return this.winList[winCounter];
    else
        return false;
};

screenFS.read = function(path,flags,offset,length) {    
    var loadPath;
    var readNode;

    var pathArray = path.split("/");

    if(flags == '0') {
        if(path === "/ctl") {
            var simpleNode = this.walk("/ctl");
            
            simpleNode.putData( winConfig.toString()+ " " + this.width + " " + this.height + " " + this.mode);  
            return simpleNode;
        }
        else if(path === "/new") {
            return "ERROR_WRITE_ONLY";           
        }
        //else if(path === "/local") {
        //    return this.walk("local");           
        //}
        else if(path === "/new") {
            return "ERROR_WRITE_ONLY";           
        }
        else if(path === "/" || path === "") {
            return this.root;
        }
        else if( this.pathIsclientWindowName(pathArray[pathArray.length - 1]) != false ) {
            var count = 0;
            var winCounter = 0;
	    var name = pathArray[pathArray.length - 1];

            while(winCounter < this.winList.length -1 && this.winList[winCounter].Name != name) {      
                winCounter++;
            }
    
            if(this.winList[winCounter].Name === name) {
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
        else if(path == "/screen")
            return 1;
        else
            return "Error: Read 1";
    }
    else if(flags =='2')
    {    
        if(this.pathIsclientWindowName(path) != false ) {
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
        else if(path === "/local/new") {
            return "ERROR_WRITE_ONLY";           
        }
    }
    else
        return "ERRORO_INVALID_READ_REQUEST";
};

screenFS.write = function(path,flags,buffer,offset,length) {
	var splitPath = path.split("/");

        if(path === "/ctl")
            return "READ_ONLY";
        else if(path === "/new") {
	    agi.touched(this.walk("local"));
            return this.createclientWindowNode(buffer);
	}
        else if(path === "/")
            return "READ_ONLY";

	else if(splitPath[1] == "local" && this.pathIsclientWindowName(splitPath[2])) {

	    if(splitPath.length === 4 && splitPath[3] === "new") {
	    	agi.log("write new view named " + buffer  +   "to window" + splitPath[2]);
		return 0;
	    } else if(splitPath.length === 4) {
	    	agi.log("write operation to window" + splitPath[2] + "and view named" + splitPath[3]  );
		return 0;
	    }
	    else
		return "READ_ONLY";
	}	
        else
            return "ERROR_FILE_NOT_FOUND";
};

screenFS.onWatched = function(path) {
	var buffer = agi.read("/local/dev/win"+ path, 0);
	this.write("/local"+path,0,buffer,0,0);
};

screenFS.init = function()
{
	
    this.width = screen.width;
    this.height = screen.height;

    if(this.width <= 670)
        this.mode = "Mobile";
    else if(this.width > 670)
        this.mode = "Desktop";

    this.root = new FileNode("/", fileTypes.Directory);
    ctlfile = new FileNode("ctl", fileTypes.Text);
    localfile = new FileNode("local", fileTypes.Directory);
    newfile = new FileNode("new", fileTypes.Text);
    this.root.addChild(ctlfile);
    this.root.addChild(localfile);
    localfile.addChild(newfile);

    agi.watch("/local/dev/win", this, this.onWatched);
  
    if(document.getElementById("log") ) {
        var facadeWin = this.createclientWindowNodeFromDiv("log");
    };
   
    if(document.getElementById("cmd") ) {
        var benixWin = this.createclientWindowNodeFromDiv("cmd");  
    };   
};

screenFS.onmount = function(mountPoint)
{
    screenFS.init();
};

screenFS.umount = function(mountPoint)
{

};

//Add this filesystem to AgI's FS list so it can be mounted
vfsList[vfsList.length] = screenFS;


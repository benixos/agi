/*
 * Copyright 2009-2015 Douglas Lockamy, dlockamy_at_gmail.com
 * All rights reserved. Distributed under the terms of the MIT License.
 *
 */

var CLIENT_ID = '259451821099-0u7uflu0celb03m8aoiagf2035rq4q6d.apps.googleusercontent.com';
var SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly'];

var timefile = 0;
var datefile = 0;
var clockDir = 0;


var fileListBuffer = [];

var dropboxFS = new fileSystem();

dropboxFS.Name = "dropboxfs"; //This is what the user mounts you as

dropboxFS.read = function(path,flags,offset,length) {    
    var loadPath;
    var readNode;

    if(flags == '0') {
        if(path === "") {
            if (fileListBuffer.length > 0) {
              for (var i = 0; i < fileListBuffer.length; i++) {
                var temp = new FileNode(fileListBuffer[i].title, fileTypes.Text);
		temp.fsReserved = fileListBuffer[i];
		this.root.addChild(temp);
              }
            }
	    return this.root;
	}
        else
            return "ERROR_FILE_NOT_FOUND";
                
        //return simpleNode;
    }
    if(flags =='1')
    {
        /*if(path == "/date" || path == "/time")
            return 2;
        else if(path == "/clock")
            return 1;
        else*/
            return "Error: Read 1";
    }
    else if(flags =='2')
    {    
        return "Error: Read - not a directory";
    }
    else if(flags == '3') { 
        var now = new Date();
        alert("this one!");
        if(path == "/time")
            return now.getHours()+":"+now.getMinutes()+":"+now.getSeconds();

        else 
            return "-1";
    }
    else
        return "Error: read 00";
};

dropboxFS.write = function(path,flags,buffer,offset,length) {
    //we are a read only FS
    return "READ_ONLY";
};


dropboxFS.myWinName;
dropboxFS.winName;
dropboxFS.myWinDiv;

/*Dropbox API example code */

var authPage = "<div id=\"authorize-div\" >\
      <span>Authorize access to Drive API</span>\
      <button id=\"writeButton\">Click to create <code>hello.txt</code> in Dropbox.</button>\
      </button><h1 onclick=\"handleAuthClick(event)\">A backup link</h1><br><br><br><br>\
    </div>\
    <pre id=\"output\"></pre>";

        var client = new Dropbox.Client({ key: 'zy4x72ffhqkxz5f' });
 
        function doHelloWorld() {
            client.writeFile('hello.txt', 'Hello, World!', function (error) {
                if (error) {
                    alert('Error: ' + error);
                } else {
                    alert('File written successfully!');
                }
            });
        }
 
        // Try to complete OAuth flow.
        client.authenticate({ interactive: false }, function (error, client) {
            if (error) {
                alert('Error: ' + error);
            }
        });
 
        if (client.isAuthenticated()) {
            doHelloWorld();
        }
 
        document.getElementById('writeButton').onclick = function () {
            client.authenticate(function (error, client) {
                if (error) {
                    alert('Error: ' + error);
                } else {
                    doHelloWorld();
                }
            });
        }

/* End Dropbox example code */

dropboxFS.init = function() {
    this.myWinName = agi.write("/dev/screen/local/new",2,"gDriveSplash");

    this.winName = agi.read("/dev/screen/local/gDriveSplash",0,0);
    this.myWinDiv = document.getElementById(this.winName.fsReserved.myName+"_mainView");

    this.myWinDiv.innerHTML = authPage;

    this.root = new FileNode("/", fileTypes.Directory);
    ctlfile = new FileNode("ctl", fileTypes.Text);
    newfile = new FileNode("new", fileTypes.Text);
    this.root.addChild(ctlfile);
    this.root.addChild(newfile);
};

dropboxFS.onmount = function(mountPoint)
{
    this.init();
};

dropboxFS.umount = function(mountPoint)
{
};

var gDrive = function() {
    agi.mount(0,"gdrivefs","/dev/gdrive","");
};

//Add this filesystem to AgI's FS list so it can be mounted
vfsList[vfsList.length] = dropboxFS;

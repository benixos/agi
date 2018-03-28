/*
 * Copyright 2009-2015 Douglas Lockamy, dlockamy_at_gmail.com
 * All rights reserved. Distributed under the terms of the MIT License.
 *
 * This is an example filesystem/starting point for a real FS
 * When mounted we present two text files named "time" and "date  
 * that when read give the current time or the current date in mm/dd/yyyy format
 */

var CLIENT_ID = '259451821099-0u7uflu0celb03m8aoiagf2035rq4q6d.apps.googleusercontent.com';
var SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly'];

var timefile = 0;
var datefile = 0;
var clockDir = 0;


var fileListBuffer = [];

var gdriveFS = new fileSystem();

gdriveFS.Name = "gdrivefs"; //This is what the user mounts you as

gdriveFS.read = function(path,flags,offset,length) {    
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

gdriveFS.write = function(path,flags,buffer,offset,length) {
    //we are a read only FS
    return "READ_ONLY";
};


gdriveFS.myWinName;
gdriveFS.winName;
gdriveFS.myWinDiv;

/*Google API example code */

var authPage = "<div id=\"authorize-div\" >\
      <span>Authorize access to Drive API</span>\
      <!--Button for the user to click to initiate auth sequence --><br><br>\
      <button id=\"authorize-button\" onclick=\"handleAuthClick(event)\">\
        Authorize\
      </button><h1 onclick=\"handleAuthClick(event)\">A backup link</h1><br><br><br><br>\
    </div>\
    <pre id=\"output\"></pre>";

      function checkAuth() {
        gapi.auth.authorize(
          {
            'client_id': CLIENT_ID,
            'scope': SCOPES.join(' '),
            'immediate': true
          }, handleAuthResult);
      };

      function handleAuthResult(authResult) {
        var authorizeDiv = document.getElementById('authorize-div');
        if (authResult && !authResult.error) {
          // Hide auth UI, then load client library.
          authorizeDiv.style.display = 'none';
          loadDriveApi();
        } else {
          // Show auth UI, allowing the user to initiate authorization by
          // clicking authorize button.
          authorizeDiv.style.display = 'inline';
        }
      }

      function handleAuthClick(event) {
        gapi.auth.authorize(
          {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
          handleAuthResult);
        return false;
      }


      function loadDriveApi() {
        gapi.client.load('drive', 'v2', listFiles);
      }

      function listFiles() {
        var request = gapi.client.drive.files.list({
            //'maxResults': 100
          });

          request.execute(function(resp) {
            var files = resp.items;
            if (files && files.length > 0) {
              for (var i = 0; i < files.length; i++) {
                var file = files[i];
		fileListBuffer[fileListBuffer.length] = file;
agi.log("loading " + fileListBuffer[fileListBuffer.length-1].title + " of type " + fileListBuffer[fileListBuffer.length-1].mimeType);
              }
            }
          });
      }

      function appendPre(message) {
        var pre = document.getElementById('output');
        var textContent = document.createTextNode(message + '\n');
        pre.appendChild(textContent);
      }

/* End Google example code */

gdriveFS.init = function() {
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

gdriveFS.onmount = function(mountPoint)
{
    this.init();
};

gdriveFS.umount = function(mountPoint)
{
};

var gDrive = function() {
    agi.mount(0,"gdrivefs","/dev/gdrive","");
};

//Add this filesystem to AgI's FS list so it can be mounted
vfsList[vfsList.length] = gdriveFS;


var notes = {};
notes.filePath = "";
var filePath = "";
notes.winID = "";
notes.winView = "";

save = function() {
    var notesInput = document.getElementById("notesInput");
    
    //console.printf("writing:<br>"+notesInput.value+"to file"+filePath+"<br>");
    agi.write(filePath,2,notesInput.value)
};

saveas = function() {
    var notesInput = document.getElementById("notesInput");
    
    //console.printf("writing:<br>"+notesInput.value+"to file"+filePath+"<br>");
    agi.write("/local/dev/gae/filePath",2,notesInput.value)
};

notes.render = function() {
    
    var buffer = "";
    if(filePath !== "") {
       var fileBuff =  agi.read(filePath,0,0,0);
        buffer = buffer + fileBuff.Data;
    }
    
    notes.winView.innerHTML = "<input type=\"text\" id=\"notesInput\"  style=\"color:black;height:400px;width:500px;overflow:scroll\"   value=\""+buffer+"\"><input type=\"button\" value=\"Save As....\" onclick=\"javascript:saveas()\" >  <input type=\"button\" value=\"Save File\" onclick=\"javascript:save()\" ><br>";
};

notes.main = function(file) {
    filePath = file;
    agi.write("/local/dev/screen/local/new",2,"Notes");
    this.winID = agi.read("/local/dev/screen/local/Notes", 0, 0);
    this.winView = document.getElementById(this.winID.fsReserved.myName+"_mainView");
    this.render();  
};

notes.cmd = function() {
    filePath = "";//file;
    agi.write("/local/dev/screen/local/new",2,"Notes");
    this.winID = agi.read("/local/dev/screen/local/Notes", 0, 0);
    this.winView = document.getElementById(this.winID.fsReserved.myName+"_mainView");
    this.render();      
}

if(app_list != "undefined")
    app_list[app_list.length] = notes;

notes.exec = notes.cmd;

cmdList[cmdList.length] = notes;

notes.cmd();

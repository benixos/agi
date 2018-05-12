var mount = {};

mount.appName = "mount";
mount.version = "0.0.1";

mount.form = "fsType, mountPoint, ";
mount.currentLine = "";

mount.main = function(arg)
{
    this.mountPoint = "/dev/fault";
    this.fs = "simplefs";
    this.flags = "";
    
    i = 0;
    while(i < arg.length) {
        if(arg[i] === "-p") {
            this.mountPoint = arg[i+1];
            i++;
        }
        else if(arg[i] === "-u") {
            i++;
        }
        else if(arg[i] === "-f") {
           // console.printf("FS= "+arg[i+1]+"<br>");
            this.fs = arg[i+1];
            i++;
        }        
        i++;   
    };

    agi.mount(0,this.fs,this.mountPoint);
};

mount.exec = mount.main;

cmdList[cmdList.length] = mount;

var umount = {};

umount.appName = "umount";
umount.version = "0.0.1";

umount.form = "mountPoint, ";
umount.currentLine = "";

umount.main = function(arg)
{
    var mountPoint = "/dev/clock";
    //console.printf("Not yet<br>");
    agi.umount(mountPoint);
};

umount.exec = umount.main;

cmdList[cmdList.length] = umount;


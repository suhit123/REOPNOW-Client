const { app, BrowserWindow, ipcMain ,screen} = require('electron')
const { v4: uuidv4 } = require('uuid');
const screenshot = require('screenshot-desktop');
var robot=require('robotjs')
var socket = require('socket.io-client')('http://172.22.192.134:5000');
var interval;
var uuid;
socket.on('connect', () => {
    console.log('Connected to server');
});
function createWindow () {
    const win = new BrowserWindow({
        width: 660,
        height: 480,resizable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    })
    win.removeMenu();
    win.loadFile('index.html')
    socket.on("mouse-move",function(data){
        var data=JSON.parse(data);
        var screenBounds = screen.getPrimaryDisplay().bounds;
        var x = data.x * (screenBounds.width / data.screenWidth);
        var y = data.y * (screenBounds.height / data.screenHeight);
        robot.moveMouse(x,y);
    })
    socket.on("mouse-click",function(data){
        robot.mouseClick();
    })
    socket.on("key-click",function(data){
        var data=JSON.parse(data);
        var key=data.key.toLowerCase();
        console.log(key);
        robot.keyTap(key);
    })
    socket.on("type",function(data){
        var data=JSON.parse(data);
        robot.keyTap(data.key);
    })
    socket.on("scroll-event",function(data){
        var data=JSON.parse(data);
        robot.scrollMouse(data.scrollX,data.scrollY);
    })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

ipcMain.on("start-share", function(event, arg) {

    uuid = uuidv4();
    console.log(uuid);
    socket.emit("join-message", uuid);
    event.reply("uuid", uuid);
    socket.on("send-message",function(data){
        var data=JSON.parse(data);

        event.reply("messages",{
            name:data.name,
            message:data.message
        
        });
    })
    socket.on("end-session",function(data){
        event.reply("end-session",true);
    })
    interval = setInterval(function() {
        screenshot().then((img) => {
            var imgStr = Buffer.from(img,'base64').toString('base64');
            var obj = {};
            obj.room = uuid;
            obj.image = imgStr;
            socket.emit("send-name",JSON.stringify({room:uuid,name:arg.name}));
            socket.emit("screen-data", JSON.stringify(obj));
        })
    }, 100)
})

ipcMain.on("stop-share", function(event, arg) {
    
    socket.emit("end-session",JSON.stringify({room:uuid}));
    clearInterval(interval);
})
ipcMain.on("send-message", function(event, arg) {
    var obj = {};
    obj.room = uuid;
    obj.message = arg.message;
    obj.name = arg.name;
    event.reply("messages",{
        name:"Me",
        message:arg.message
    
    });
    socket.emit("send-message", JSON.stringify(obj));
})
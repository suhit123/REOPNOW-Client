const { app, BrowserWindow, ipcMain } = require('electron')
const { v4: uuidv4 } = require('uuid');
const screenshot = require('screenshot-desktop');
var robot=require('robotjs')
var socket = require('socket.io-client')('http://172.22.198.67:5000');
var interval;
socket.on('connect', () => {
    console.log('Connected to server');
});
function createWindow () {
    const win = new BrowserWindow({
        width: 500,
        height: 150,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    })
    win.removeMenu();
    win.loadFile('index.html')
    socket.on("mouse-move",function(data){
        var data=JSON.parse(data);
        var x=data.x;
        var y=data.y;
        robot.moveMouse(x,y);
        console.log(data);
    })
    socket.on("mouse-click",function(data){
        robot.mouseClick();
    })
    socket.on("type",function(data){
        var data=JSON.parse(data);
        robot.keyTap(data.key);
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

    var uuid = "test";
    console.log(uuid);
    socket.emit("join-message", uuid);
    event.reply("uuid", uuid);

    interval = setInterval(function() {
        screenshot().then((img) => {
            var imgStr = Buffer.from(img).toString('base64');
            var obj = {};
            obj.room = uuid;
            obj.image = imgStr;
            socket.emit("screen-data", JSON.stringify(obj));
        })
    }, 100)
})

ipcMain.on("stop-share", function(event, arg) {
    clearInterval(interval);
})
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http, {
    cors: {
      origin: "*",
      credentials: true
    }
  });
require('dotenv').config();
const cors=require('cors');
app.use(cors());
// app.get('/view', (req, res) => {
//     res.sendFile(__dirname + '/display.html');
// })
// io.origins('http://localhost:3000')
io.on('connection', (socket)=> {

    socket.on("join-message", (roomId) => {
        socket.join(roomId);
        console.log("User joined in a room : " + roomId);
    })

    socket.on("screen-data", function(data) {
        data = JSON.parse(data);
        var room = data.room;
        var imgStr = data.image;
        socket.broadcast.to(room).emit('screen-data', imgStr);
    })
    socket.on("mouse-move",function(data){
        var room =JSON.parse(data).room;
        socket.broadcast.to(room).emit("mouse-move",data);
    })
    socket.on("mouse-click",function(data){
        var room =JSON.parse(data).room;
        socket.broadcast.to(room).emit("mouse-click",data);
    })
    socket.on("keyup",function(data){
        var room =JSON.parse(data).room;
        socket.broadcast.to(room).emit("keyup",data);
    })
    socket.on("key-click",function(data){
        var room =JSON.parse(data).room;
        socket.broadcast.to(room).emit("key-click",data);
    })
    socket.on("scroll-event",function(data){
        var room =JSON.parse(data).room;
        socket.broadcast.to(room).emit("scroll-event",data);
    })
    socket.on("type",function(data){
        var room =JSON.parse(data).room;
        socket.broadcast.to(room).emit("type",data);
    })
    socket.on("send-message",function(data){
        var room =JSON.parse(data).room;
        socket.broadcast.to(room).emit("send-message",data);
    })
    socket.on("is-typing",function(data){
        var room =JSON.parse(data).room;
        socket.broadcast.to(room).emit("is-typing",data);
    })
    socket.on("send-name",function(data){
        var room =JSON.parse(data).room;
        socket.broadcast.to(room).emit("send-name",data);
    })
    socket.on("end-session",function(data){
        var room =JSON.parse(data).room;
        socket.broadcast.to(room).emit("end-session",data);
    })
})

var server_port =process.env.PORT;
http.listen(server_port, () => {
    console.log("Started on : "+ server_port);
})
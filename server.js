var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io').listen(http);

//Declare Variables
var user = [];
var connections = [];

//Set route app
app.get('/', function (req, res) {
  console.log(`root: ${__dirname}`);
  res.sendFile(__dirname + '/index.html');
});

//Socket.io precess
io.on('connection', function (socket) {
  socket.emit('hi', {
    msg: "Hello, Welcome!"
  });
  connections.push(socket);
  console.log("Connected: %s sockets connected", connections.length);

  socket.on('chat message', function (data) {
    console.log('message: ' + data.msg);
    let user = connections.indexOf(socket) + 1;
    io.emit('chat message', "user " + user + ":" + data.msg);
  });

  //Client typing
  socket.on('typing', function (data) {
    let user = connections.indexOf(socket) + 1;
    let msg = data;
    if (msg != '') {
      socket.broadcast.emit('typing', `<p><em>user${user} is typing...</em></p>`);
    } else {
      socket.broadcast.emit('typing', "");
    }
  });

  //Disconnect 
  socket.on('disconnect', function () {
    connections.splice(connections.indexOf(socket), 1);
    console.log("Disconnected: %s sockets connected", connections.length);
  });
});

http.listen(process.env.PORT || 3000, function () {
  console.log("Server running...");
});
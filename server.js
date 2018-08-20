var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io').listen(http);
user = [];
connections = [];


app.get('/', function (req, res) {
  console.log(`root: ${__dirname}`);
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  // console.log(connections);
  socket.broadcast.emit('hi');
  connections.push(socket);
  console.log("Connected: %s sockets connected", connections.length);

  //Disconnect 
  socket.on('disconnect', function () {
    connections.splice(connections.indexOf(socket), 1);
    console.log("Disconnected: %s sockets connected", connections.length);
  });

  socket.on('chat message', function (data) {
    console.log('message: ' + data.msg);
    let user = connections.indexOf(socket) + 1;
    io.emit('chat message', "user " + user + ":" + data.msg);
  });

});

http.listen(process.env.PORT || 3000, function () {
  console.log("Server running...");
});
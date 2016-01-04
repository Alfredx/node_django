var http = require('http');
var sio = require('socket.io');
var chatroom = require('./chatroom');

var server = http.createServer();
var io = sio.listen(server, {
    log: true,
});
chatroom.init(io);
var port = 9000;
server.listen(9000, function startapp() {
    console.log('Nodejs app listening on ' + port);
});

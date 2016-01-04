var cookie_reader = require('cookie');
var http = require('http');
var redis = require('socket.io-redis');
var sio = require('socket.io');
var querystring = require('querystring');

function initSocketEvent(socket, sub) {
    socket.emit('handshake', {
        'data_number': 1,
        'data_string': 'somestring'
    });

    socket.on('new_chatroom', function onSocketNewChatroom(data) {
        sub.subscribe(data.channel);
        sub.on('message', function onSubNewMessage(data) {
            
        });
    });
};


exports.init = function(io) {
    var sub = io.adapter(redis({
        'host': 'localhost',
        'port': 6379,
        'db': 3,
    })).subClient;
    io.on('connection', function onSocketConnection(data){
        console.log('new connection');
        initSocketEvent(io, sub);
    });
};

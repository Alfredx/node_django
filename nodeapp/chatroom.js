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
        console.log('new_chatroom');
        // var options = {
        //     host: 'localhost',
        //     port: 8000,
        //     path: '/channel_name',
        //     method: 'GET',
        //     headers: {
        //         'Content-Type': 'application/x-www-form-urlencoded',
        //         'Content-Length': values.length,
        //         'X-CSRFToken': data.csrftoken
        //     }
        // };
        var req = http.get('http://localhost:8000/channel_name/', function(res) {
            // sub.subscribe(data.channel);
            // sub.on('message', function onSubNewMessage(data) {

            // });
            res.setEncoding('utf-8');
            res.on('data', function(data){
                console.log(data);
            });
            res.resume();
        }).on('error', function(e) {
            console.log('error geting channel_name: ' + e);
        });

    });
};


exports.init = function(io) {
    var sub = io.adapter(redis({
        'host': 'localhost',
        'port': 6379,
        'db': 3,
    })).subClient;

    io.on('connection', function onSocketConnection(socket) {
        console.log('new connection');
        initSocketEvent(socket, sub);
    });
};

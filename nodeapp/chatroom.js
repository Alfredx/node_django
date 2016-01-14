var cookie_reader = require('cookie');
var http = require('http');
// var redis = require('socket.io-redis');
var redis = require('redis');
var sio = require('socket.io');
var querystring = require('querystring');

function initSocketEvent(socket) {
    var channel_name = '';
    var sub = redis.createClient();

    socket.on('new_chatroom', function onSocketNewChatroom(data) {
        var req = http.get('http://localhost:8000/nodetest/channel_name/', function onGetChannelName(res) {
            res.setEncoding('utf-8');
            res.on('data', function onGetData(data) {
                var obj = JSON.parse(data)
                console.log(obj);
                socket.emit('channel_name', {
                    'channel_name': obj.channel
                });
                channel_name = obj.channel;
                sub.subscribe(obj.channel);
                sub.on('message', function onSubNewMessage(channel, data) {
                    socket.emit('channel_msg', {
                        'channel_name': channel,
                        'data': data
                    });
                });
            });
            res.resume();
        }).on('error', function(e) {
            console.log('error geting channel_name: ' + e);
        });
    });

    socket.on('client_msg', function onSocketClientMsg(data) {
        console.log(data);
        var values = querystring.stringify({
            'channel_name': channel_name,
            'msg': data.msg
        });
        var options = {
            host: 'localhost',
            port: 8000,
            path: '/nodetest/node_api/',
            method: 'POST',
            headers: {
                'Cookie': socket.handshake.headers.cookie,
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': values.length,
            }
        };
        console.log(options.headers.Cookie);
        var post_req = http.request(options, function onPostData(res) {
            res.setEncoding('utf-8');
            res.on('data', function(chunk) {
                // console.log('post res: ' + chunk);
            })
        }).on('error', function(e) {
            // console.log('post error: '+e);
        });
        post_req.write(values);
        post_req.end();
    });
};


exports.init = function(io) {
    io.on('connection', function onSocketConnection(socket) {
        console.log('new connection');
        initSocketEvent(socket);
    });
};

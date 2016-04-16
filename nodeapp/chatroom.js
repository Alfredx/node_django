var cookie_reader = require('cookie');
// var redis = require('socket.io-redis');
var redis = require('redis');
var sio = require('socket.io');
var querystring = require('querystring');
var django_request = require('./django_request');

function initSocketEvent(socket) {
    socket.on('get', function() {
        console.log('event: get');
        django_request.get('/get_data/', function(res){
            console.log('get_data response: %j',res);
        }, function(err) {
            console.log('error get_data: '+e);
        });
    });
    socket.on('post', function(data) {
        console.log('event: post');
        django_request.post(socket.handshake.headers.cookie, '/post_data/', {'data1':123, 'data2':'abc'}, function(res){
            console.log('post_data response: %j', res);
        }, function(err){
            console.log('error post_data: '+e);
        });
    });
    var channel_name = '';
    var sub = redis.createClient();

    socket.on('new_chatroom', function onSocketNewChatroom(data) {
        django_request.get('/nodetest/channel_name/', function onGetChannelName(data) {
            var obj = data
            console.log(obj);
            socket.emit('channel_name', {
                'channel_name': obj.channel
            });
            channel_name = obj.channel;
            sub.subscribe(obj.channel);
            sub.on('message', function onSubNewMessage(channel, data) {
                console.log('what');
                socket.emit('channel_msg', {
                    'channel_name': channel,
                    'data': data
                });
            });
        }, function onGetChannelNameError(e) {
            console.log('error geting channel_name: ' + e);
        });
    });

    socket.on('client_msg', function onSocketClientMsg(data) {
        console.log(data);

        django_request.post(socket, '/nodetest/node_api/', {
            'channel_name': channel_name,
            'msg': data.msg,
            'csrftoken': data.csrftoken,
        }, function onNodeApiPostData(data) {

        }, function onNodeApiPostDataError(e) {
            console.log('post error: %s', e);
        });
    });
};


exports.init = function(io) {
    io.on('connection', function onSocketConnection(socket) {
        console.log('new connection');
        initSocketEvent(socket);
    });
};

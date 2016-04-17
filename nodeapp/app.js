var http = require('http');
var sio = require('socket.io');
var chatroom = require('./chatroom');
var qs = require('querystring');

var server = http.createServer();
var io = sio.listen(server, {
    log: true,
});
chatroom.init(io);
var port = 9000;

function onGetData(request, response){
    if (request.method == 'GET'){
        response.writeHead(200, {"Content-Type": "application/json"});
        jsonobj = {
            'data1': 123,
            'data2': 'abc'
        }
        response.end(JSON.stringify(jsonobj));
    } else {
        response.writeHead(403);
        response.end();
    }
}
function onPostData(request, response){
    if (request.method == 'POST'){
        var body = '';

        request.on('data', function (data) {
            body += data;

            if (body.length > 1e6)
                request.connection.destroy();
        });

        request.on('end', function () {
            var post = qs.parse(body);
            response.writeHead(200, {'Content-Type': 'application/json'});
            jsonobj = {
                'data1': 123,
                'data2': 'abc',
                'post_data': post,
            }
            response.end(JSON.stringify(jsonobj));
        });
    } else {
        response.writeHead(403);
        response.end();
    }
}
server.on('request', function(request, response){
    console.log('url: %s, method: %s', request.url, request.method);
    switch (request.url) {
        case '/node_get_data/':
            onGetData(request, response);
            break;
        case '/node_post_data/':
            onPostData(request, response);
            break;
        default:
            break;
    };
});
server.listen(9000, function startapp() {
    console.log('Nodejs app listening on ' + port);
});

// var django_request = require('./django_request');

// django_request.get('/get_data/', function(data){
//     console.log('get_data response: %j',data);
// }, function(err) {
//     console.log('error get_data: '+e);
// });

var redis = require('redis');
// subscribe
var sub = redis.createClient();
sub.subscribe('test_channel');
sub.on('message', function onSubNewMessage(channel, data) {
    console.log(channel, data);
});
// publish
var pub = redis.createClient();
pub.publish('test_channel', 'nodejs data published to test_channel');
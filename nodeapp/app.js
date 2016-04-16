var http = require('http');
var sio = require('socket.io');
var chatroom = require('./chatroom');

var server = http.createServer();
var io = sio.listen(server, {
    log: true,
});
chatroom.init(io);
var port = 9000;

function onGetData(request, response){
    response.writeHead(200, {"Content-Type": "application/json"});
    jsonobj = {
        'data1': 123,
        'data2': 'abc'
    }
    response.end(JSON.stringify(jsonobj));
}
function onPostData(request, response){
    
}
server.on('request', function(request, response){
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
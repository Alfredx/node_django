var http = require('http');

function get (url, on_data_callback, on_err_callback) {
    var req = http.get(url, function onHttpGet(res) {
        res.setEncoding('utf-8');
        res.on('data', function onGetData (data) {
            on_data_callback(data);
        });
        res.resume();
    }).on('error', function(e) {
        on_err_callback(e);
    });
}


function urlOption (path, host, port) {
    if (host == undefined)
        host = 'www.artcm.cn';
    if (port == undefined)
        port = 80
}


function post (url_option, socket, values, on_data_callback, on_err_callback) {
    var options = {
        host: url_option.host,
        port: url_option.port,
        path: url_option.path,
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
}
/**
 * Created by chenhao on 15/4/16.
 */

var http = require('http');

var device_id = 'imTP5xZh4QHjcn2Dw';

var host = "localhost", port = 3000;
// var host = "192.168.1.240", port = 3000;
// var host = "mcotton.microduino.cn", port = 80;

var url = '/api/v1.0/ce/' + device_id;

var options = {
    host: host,
    port: port,
    path: url,
    method: 'GET'
};

var req = http.request(options, function (res) {
    var output = '';
    // console.log(options.host + ':' + res.statusCode);
    res.setEncoding('utf8');

    res.on('data', function (chunk) {
        output += chunk;
    });

    res.on('end', function () {
        var obj = JSON.parse(output);
        console.info('GET result: ' + res.statusCode, obj);
    });
});

req.end();

req.on('error', function (err) {
    console.error(err);
});


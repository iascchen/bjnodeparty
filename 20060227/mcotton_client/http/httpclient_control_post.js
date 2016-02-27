/**
 * Created by chenhao on 15/4/16.
 */

var http = require('http');

var device_id = 'imTP5xZh4QHjcn2Dw';

var host = "localhost", port = 3000;
// var host = "192.168.1.240", port = 3000;
// var host = "mcotton.microduino.cn", port = 80;

var url = '/api/v1.0/ce/';

var jsonObject = JSON.stringify({device_id: device_id,
    control_name: "Status", control_value: "false"});

var postheaders = {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(jsonObject, 'utf8')
};

var optionspost = {
    host: host,
    port: port,
    path: url,
    method : 'POST',
    headers : postheaders
};

// do the POST call
var reqPost = http.request(optionspost, function(res) {
    console.log("statusCode: ", res.statusCode);

    res.on('data', function(d) {
        console.info('POST result:\n');
        process.stdout.write(d);
        console.info('\n\nPOST completed');
    });
});

// write the json data
reqPost.write(jsonObject);
reqPost.end();

reqPost.on('error', function(e) {
    console.error(e);
});
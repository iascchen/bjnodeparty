/**
 * Created by chenhao on 15/4/16.
 */

var http = require('http');

var host = "localhost", port = 3000;
// var host = "mcotton.microduino.cn", port = 80;
var device_id_city = "SFymCeiRxDYNSNBSN";

var now = new Date().getTime();

var jsonObject_citys = [
    {sid: now, Cell: {"N": "0", "ID": "1991", "T": "1", "D": {"e": "1995", "w": "0", "s": "0", "n": "1992"}}},
    {sid: now, Cell: {"N": "1", "ID": "1995", "T": "5", "D": {"e": "0", "w": "1991", "s": "0", "n": "1996"}}},
    {sid: now, Cell: {"N": "2", "ID": "1992", "T": "2", "D": {"e": "1991", "w": "0", "s": "0", "n": "1996"}}},
    {sid: now, Cell: {"N": "3", "ID": "1996", "T": "6", "D": {"e": "1993", "w": "1992", "s": "1995", "n": "0"}}},
    {sid: now, Cell: {"N": "4", "ID": "1993", "T": "3", "D": {"e": "0", "w": "0", "s": "1996", "n": "0"}}},
];

postData = function (myAppKitId, jsonData) {
    jsonData.device_id = myAppKitId;

    var jsonObject = JSON.stringify(jsonData);

    var postheaders = {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(jsonObject, 'utf8')
    };

    var optionspost = {
        host: host,
        port: port,

        path: '/api/v1.0/d',
        method: 'POST',
        headers: postheaders
    };

    // do the POST call
    var reqPost = http.request(optionspost, function (res) {
        console.log("statusCode: ", res.statusCode);

        res.on('data', function (d) {
            console.info('POST result:\n');
            process.stdout.write(d);
            console.info('\n\nPOST completed');
        });
    });

// write the json data
    reqPost.write(jsonObject);
    reqPost.end();

    reqPost.on('error', function (e) {
        console.error(e);
    });
};

for (var j = 0; j < jsonObject_citys.length; j++) {
    postData(device_id_city, jsonObject_citys[j]);
}
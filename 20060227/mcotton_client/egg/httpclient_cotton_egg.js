/**
 * Created by chenhao on 15/4/16.
 */

var http = require('http');

 var host = "localhost", port = 3000;
//var host = "mcotton.microduino.cn", port = 80;
var device_id_gps_weather = "cK5j7CpyFmbMLGeFr";

var now = new Date().getTime();

//TODO
var jsonObject_weather = [
    {"Temperature 01":"21.3750","Temperature 02":"21.2500","Temperature 03":"21.1250","Temperature 04":"21.2500",
        "Temperature 05":"21.1250","Temperature 06":"21.2500","Temperature 07":"21.5000","Temperature 08":"21.6250",
        "Quaternion 1":"0.30","Quaternion 2":"0.92","Quaternion 3":"-0.10","Quaternion 4":"0.23"},

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


for (var i = 0; i < jsonObject_weather.length; i++) {
    postData(device_id_gps_weather, jsonObject_weather[i]);
}
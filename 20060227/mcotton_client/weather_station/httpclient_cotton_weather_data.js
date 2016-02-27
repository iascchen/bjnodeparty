/**
 * Created by chenhao on 15/4/16.
 */

var http = require('http');

var host = "localhost", port = 3000;
// var host = "mcotton.microduino.cn", port = 80;
var device_id_weather = "imTP5xZh4QHjcn2Dw";

var now = new Date().getTime();

var jsonObject_weather = [
    {Temperature: "22", Humidity: "50", Lightness: "1000", "Air Pressure": "100.00",
        "PM 2.5": "5.00", "Air Pollution": "3.00"},
    {Temperature: "21", Humidity: "51", Lightness: "1002", "Air Pressure": "99.00"},
    {Temperature: "20", Humidity: "52", Lightness: "1004", "Air Pressure": "98.00"},
    {Temperature: "19", Humidity: "53", Lightness: "1006", "Air Pressure": "97.00"},
    {Temperature: "18", Humidity: "54", Lightness: "1008", "Air Pressure": "96.00"},
    {Temperature: "17", Humidity: "55", Lightness: "1010", "Air Pressure": "95.00"},
    {Temperature: "16", Humidity: "56", Lightness: "1012", "Air Pressure": "94.00"},
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
    postData(device_id_weather, jsonObject_weather[i]);
}
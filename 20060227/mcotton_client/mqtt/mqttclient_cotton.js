//var user_id = "jzzy4cPiuh9kGSXTm";
//var device_id_weather = "H99yyeYKLE36TvsAS";

var mqtt = require('mqtt');

var user_id = "eEf4YBGRBG55DFa8J";
var device_id_weather = "imTP5xZh4QHjcn2Dw";

var host = "localhost", mqtt_port = 1883;

var jsonObject_weather = [
    {
        Temperature: "22", Humidity: "50", Lightness: "1000", "Air Pressure": "100.00",
        "PM 2.5": "5.00", "Air Pollution": "3.00"
    },
    {Temperature: "21", Humidity: "51", Lightness: "1002", "Air Pressure": "99.00"},
    {Temperature: "20", Humidity: "52", Lightness: "1004", "Air Pressure": "98.00"},
    {Temperature: "19", Humidity: "53", Lightness: "1006", "Air Pressure": "97.00"},
    {Temperature: "18", Humidity: "54", Lightness: "1008", "Air Pressure": "96.00"},
    {Temperature: "17", Humidity: "55", Lightness: "1010", "Air Pressure": "95.00"},
    {Temperature: "16", Humidity: "56", Lightness: "1012", "Air Pressure": "94.00"},
];

var control_message = "c";
var data_message = "d";

var contorl_topic = "v1.0/c/"+user_id+"/" + device_id_weather;
var data_topic = "v1.0/d/"+user_id+"/" + device_id_weather;

var settings = {
    // keepalive: 10,
    // clean: false,
    // protocolId: 'MQIsdp',
    // protocolVersion: 3,
    // clientId: 'client-b',

    host: host,
    port: mqtt_port,
    username: user_id,
    password: device_id_weather
};

publishData = function (myAppKitId, jsonData) {
    jsonData.device_id = myAppKitId;
    client.publish(data_topic , JSON.stringify(jsonData));
};

var client = mqtt.connect(settings);

client.on('connect', function () {
    client.subscribe(contorl_topic);
    client.subscribe(data_topic);

    for (var i = 0; i < jsonObject_weather.length; i++) {
        // console.log(data_topic, jsonObject_weather[i]);

        publishData(device_id_weather, jsonObject_weather[i]);
    }
});

client.on('message', function (topic, message) {
    // message is Buffer
    console.log(topic, message.toString());

    // var params = message_info(topic);
    // console.log(params);

    // client.end();
});


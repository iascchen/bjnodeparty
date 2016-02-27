var mqtt = require('mqtt'),
    _ = require('underscore');

var Cylon = require('cylon');

var user_id = "eEf4YBGRBG55DFa8J";
var device_id_weather = "imTP5xZh4QHjcn2Dw";

var host = "192.168.1.128", mqtt_port = 1883;
// var host = "localhost", mqtt_port = 1883;

var contorl_topic = "v1.0/c/" + user_id + "/" + device_id_weather;
var data_topic = "v1.0/d/" + user_id + "/" + device_id_weather;

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

Cylon.robot({
    connections: {
        arduino: {adaptor: 'firmata', port: '/dev/ttyS0'}
    },

    devices: {
        led: {driver: 'led', pin: 10}
    },

    work: function (cylon_device) {

        var client = mqtt.connect(settings);

        client.on('connect', function () {
            client.subscribe(contorl_topic);
            client.subscribe(data_topic);
        });

        client.on('message', function (topic, message) {
            // message is Buffer
            console.log(topic, message.toString());
            var msg = JSON.parse(message.toString());

            if (msg.Status == "true") {
                console.log("turnOn");
                //cylon_device.led.turnOn();
            } else {
                console.log("turnOff");
                //cylon_device.led.turnOff();
            }

            // client.end();
        });
    }
}).start();
var DDPClient = require("ddp"),
    _ = require('underscore');
var Cylon = require('cylon');

var device_id = "imTP5xZh4QHjcn2Dw";

// var host = "localhost", port = 3000;
var host = "192.168.1.128", port = 3000;

var useremail = "iasc@163.com";
var pwd = "123456";

var ws_url = 'ws://' + host + ':' + port + '/websocket';

var ddp_ready = false;
var cylon_device = null;

var ddpclient = new DDPClient({
    url: ws_url
});

var sendControlMsg = function (device_Id, name, value) {
    ddpclient.call(
        'controlEventInsert',
        [{
            device_id: device_Id,
            control_name: name,
            control_value: value
        }],
        function (err, result) {
            if (err) console.log('controlEventInsert, error: ' + err);
            console.log('controlEventInsert, result: ' + result._id);
        },
        function () {              // callback which fires when server has finished
            console.log('Inserted');  // sending any updated documents as a result of
        }
    );
};

/*
 * Connect to the Meteor Server
 */
ddpclient.connect(function (error, wasReconnect) {
    // If autoReconnect is true, this callback will be invoked each time
    // a server connection is re-established

    if (error) {
        console.log("DDP connection error!");
        return;
    }

    if (wasReconnect) {
        console.log("Reestablishment of a connection.");
    }

    console.log("connected!");

    ddpclient.call("login", [
        {user: {email: useremail}, password: pwd}
    ], function (err, result) {
        console.log(result);
        user_id = result.id;
        token = result.token;

        if (token) {
            console.log("Logined!", user_id, token);

            /*
             * Subscribe to a Meteor Collection
             */

            ddpclient.subscribe(
                "dataevents",                  // name of Meteor Publish function to subscribe to
                [],          // any parameters used by the Publish function
                function () {             // callback when the subscription is complete
                    console.log("dataevents ==>:");
                    // console.log(ddpclient.collections.dataevents);
                }
            );

            ddpclient.subscribe(
                "controlevents",                  // name of Meteor Publish function to subscribe to
                [],                       // any parameters used by the Publish function
                function () {             // callback when the subscription is complete
                    console.log("controlevents ==>:");
                    // console.log(ddpclient.collections.controlevents);
                }
            );

            /*
             * observe DataEvents
             */
            var data_observer = ddpclient.observe("dataevents");

            data_observer.added = function (id) {
                console.log("[ADDED] to " + data_observer.name + ":  " + id);

                var event = _(ddpclient.collections.dataevents).findWhere({_id: id});
                console.log("[ADDED] dataevents ", event)
            };

            /*
             * observe ControlEvents
             */
            var control_observer = ddpclient.observe("controlevents");

            control_observer.added = function (id) {
                console.log("[ADDED] to " + control_observer.name + ":  " + id);

                var event = _(ddpclient.collections.controlevents).findWhere({_id: id});
                console.log("[ADDED] controlevents ", event);

                if (event.control_value == 'true') {
                    console.log("turnOn");
                    if (cylon_device) cylon_device.led.turnOn();
                } else {
                    console.log("turnOff");
                    if (cylon_device) cylon_device.led.turnOff();
                }
            };

            ddp_ready = true;
        }
    });
});

Cylon.robot({
    connections: {
        arduino: {adaptor: 'firmata', port: '/dev/ttyS0'}
    },

    devices: {
        button: {driver: 'button', pin: 9},
        led: {driver: 'led', pin: 10}
    },

    work: function (my) {
        cylon_device = my;

        my.button.on('push', function () {
            console.log("Button pushed!");
            my.led.turnOn();

            if (ddp_ready) {
                sendControlMsg(device_id, "Status", "true")
            }
        });
        my.button.on('release', function () {
            console.log("Button released!");
            my.led.turnOff();

            if (ddp_ready) {
                sendControlMsg(device_id, "Status", "false")
            }
        });
    }
}).start();
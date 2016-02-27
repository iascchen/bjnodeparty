var DDPClient = require("ddp"),
    _ = require('underscore');

var Cylon = require('cylon');

var device_id = "imTP5xZh4QHjcn2Dw";

// var host = "localhost", port = 3000;
var host = "192.168.1.128", port = 3000;

var ws_url = 'ws://' + host + ':' + port + '/websocket';

var useremail = "iasc@163.com";
var pwd = "123456";

var ddpclient = new DDPClient({
    url: ws_url
});

Cylon.robot({
    connections: {
        arduino: {adaptor: 'firmata', port: '/dev/ttyS0'}
    },

    devices: {
        led: {driver: 'led', pin: 10}
    },

    work: function (cylon_device) {
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
                }
            });

            /*
             * Observe a collection.
             */
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
                    //cylon_device.led.turnOn();
                }else{
                    console.log("turnOff");
                    //cylon_device.led.turnOff();
                }
            };


            //Debug information
            /*
             ddpclient.on('message', function (msg) {
             console.log("ddp message: " + msg);
             });

             ddpclient.on('socket-close', function (code, message) {
             console.log("Close: %s %s", code, message);
             });

             ddpclient.on('socket-error', function (error) {
             console.log("Error: %j", error);
             });
             */

            // close

            //setTimeout(function () {
            //    data_observer.stop();
            //    control_observer.stop();
            //    ddpclient.close();
            //}, 30000);

        });
    }
}).start();
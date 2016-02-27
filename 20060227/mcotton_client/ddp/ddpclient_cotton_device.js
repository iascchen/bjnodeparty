var DDPClient = require("ddp"),
    _ = require('underscore');

//var device_id = "imTP5xZh4QHjcn2Dw";
var host = "localhost", port = 3000;
var ws_url = 'ws://' + host + ':' + port + '/websocket';

var useremail = "iasc@163.com";
var pwd = "123456";

var ddpclient = new DDPClient({
    url: ws_url
});

var user_id = null, token = null;

var project_weather_station, device_weather_station, device_id;
var data_observer, control_observer;

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
                "projects",                  // name of Meteor Publish function to subscribe to
                [100],                       // any parameters used by the Publish function
                function () {             // callback when the subscription is complete
                    // console.log("projects all ==> ", ddpclient.collections.projects);

                    project_weather_station = _.findWhere(ddpclient.collections.projects, {name: 'Weather Station'});
                    console.log("projects weather_station  ==> ", project_weather_station);
                    console.log("projects weather_station id ==> ", project_weather_station._id);

                    /*
                     * Subscribe to a Meteor Collection
                     */
                    ddpclient.subscribe(
                        "devices",                  // name of Meteor Publish function to subscribe to
                        [user_id],          // any parameters used by the Publish function
                        function () {             // callback when the subscription is complete
                            // console.log("devices all ==> ", ddpclient.collections.devices);

                            device_weather_station = _.filter(ddpclient.collections.devices,
                                function (device) {
                                    return (device.name == '1 Test Device') && ( device.status < 4);
                                });
                            console.log("device weather_station  ==> ", device_weather_station);

                            if (device_weather_station.length > 0) {
                                device_id = device_weather_station[0]._id;
                                console.log("device weather_station id ==> ", device_id);
                            }
                            else {
                                //////////////////////////////
                                // create new device
                                //////////////////////////////

                                var device = ddpclient.call(
                                    'deviceInsert',
                                    [{
                                        name: '1 Test Device',
                                        desc: '我的气象站',
                                        project_id: project_weather_station._id
                                    }],
                                    function (err, result) {
                                        if(err) console.log('deviceInsert, error: ' + err);
                                        console.log('deviceInsert, result: ' + result._id);

                                        device_id = result._id;
                                    },
                                    function () {              // callback which fires when server has finished
                                        console.log('Inserted');  // sending any updated documents as a result of
                                        // console.log(ddpclient.collections.devices);  // calling this method
                                    }
                                );
                            }

                            // Device Data Events
                            ddpclient.subscribe(
                                "dataevents",                  // name of Meteor Publish function to subscribe to
                                [user_id],          // any parameters used by the Publish function
                                function () {             // callback when the subscription is complete
                                    // console.log("dataevents all ==> ", ddpclient.collections.dataevents);

                                    var datas = _.filter(ddpclient.collections.dataevents, {device_id: device_id});
                                    console.log("datas  ==> ", datas);
                                }
                            );

                            // Device Control Events
                            ddpclient.subscribe(
                                "controlevents",                  // name of Meteor Publish function to subscribe to
                                [user_id],          // any parameters used by the Publish function
                                function () {             // callback when the subscription is complete
                                    // console.log("controlevents all ==> ", ddpclient.collections.controlevents);

                                    var controls = _.filter(ddpclient.collections.controlevents, {device_id: device_id});
                                    console.log("controls  ==> ", controls);
                                }
                            );

                        }
                    );
                }
            );
        }
    });

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

    setTimeout(function () {
        // observer.stop();
        ddpclient.close();
    }, 5000);

});

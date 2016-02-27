var DDPClient = require("ddp");

var device_id = "imTP5xZh4QHjcn2Dw";
var host = "localhost", port = 3000;
var ws_url = 'ws://' + host + ':' + port + '/websocket';

var ddpclient = new DDPClient({
    url: ws_url
});

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

    /*
     * Subscribe to a Meteor Collection
     */
    ddpclient.subscribe(
        "datamessages",                  // name of Meteor Publish function to subscribe to
        [],                       // any parameters used by the Publish function
        function () {             // callback when the subscription is complete
            console.log("datamessages complete:");
            console.log(ddpclient.collections.datamessages);
        }
    );

    /*
     * Observe a collection.
     */
    var observer = ddpclient.observe("datamessages");

    observer.added = function (id) {
        console.log("[ADDED] to " + observer.data_message + ":  " + id);
    };
    observer.changed = function (id, oldFields, clearedFields) {
        console.log("[CHANGED] in " + observer.data_message + ":  " + id);
        console.log("[CHANGED] old field values: ", oldFields);
        console.log("[CHANGED] cleared fields: ", clearedFields);
    };
    observer.removed = function (id, oldValue) {
        console.log("[REMOVED] in " + observer.data_message + ":  " + id);
        console.log("[REMOVED] previous value: ", oldValue);
    };

    // CRUD

    var message = ddpclient.call(
        'dataMessageInsert',
        [{device_id: device_id, Temperature: "16", Humidity: "50", Test: "5"}],
        function (err, result) {
            if(err) console.log('dataMessageInsert, error: ' + err);

            console.log('dataMessageInsert, result: ' + result._id);
        },
        function () {              // callback which fires when server has finished
            console.log('Inserted');  // sending any updated documents as a result of
            // console.log(ddpclient.collections.controlevents);  // calling this method

            ddpclient.call(
                'dataEventsQuery',
                [{
                    device_id: device_id
                }]
                , function (err, result) {
                    if(err) console.log('dataEventsQuery, error: ' + err);
                    console.log('dataEventsQuery, result: ' + JSON.stringify(result));
                }
            );

            ddpclient.call(
                'dataEventsQuerySmall',
                [{
                    device_id: device_id
                }]
                , function (err, result) {
                    if(err) console.log('dataEventsQuerySmall, error: ' + err);
                    console.log('dataEventsQuerySmall, result: ' + JSON.stringify(result));
                }
            );
        }
    );

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
    }, 10000);

});

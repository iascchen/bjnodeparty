/**
 * Created by chenhao on 15/4/16.
 */

var request = require('request'),
    _ = require('underscore');

var host = "localhost", port = 3000;
var useremail = "iasc@163.com", pwd = "123456";

var API = "http://" + host + ":" + port + "/api";
var LOGIN = API + "/login";

var API_VER = API + "/v1.0";
var APP_KITS = API_VER + "/projects";
var MY_APP_KITS = API_VER + "/devices";
var DATA_EVENTS = API_VER + "/de";
var CONTROL_EVENTS = API_VER + "/ce";
var DATA_VISUAL = API_VER + "/vis";

var user_id = null, x_token = null;

var appkit_weather_station, myappkit_weather_station, device_id;
var data_observer, control_observer;

var login = function (useremail, pwd) {
    var jsonData = {user: useremail, password: pwd};

    request({
        method: 'POST', uri: LOGIN,
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(jsonData)
    }).on('data', function (data) {
        console.log('Response Data: ' + data);

        // decompressed data as it is received
        var ret = JSON.parse(data);

        user_id = ret.data.userId;
        x_token = ret.data.authToken;

        if (x_token) {
            console.log("Logined!", user_id, x_token);

            getAppKits();
        }
    });
};

var getAppKits = function () {
    request({
        method: 'GET', uri: APP_KITS,
    }).on('data', function (data) {
        console.log('Response AppKits: ' + data);
        var ret = JSON.parse(data);

        for (var i in ret) {
            console.log('Response AppKit: ' + JSON.stringify(ret[i]));
        }

        appkit_weather_station = _(ret).findWhere({name: 'Weather Station'});
        console.log('Response AppKit: ' + JSON.stringify(appkit_weather_station));

        // Create new MyAppKit
        if (x_token) {
            getMyAppKits();

            // putDevice(project_weather_station._id, "My Weather Station");
        }
    });
};

var putMyAppKit = function (app_kit_id, name) {
    var jsonData = {app_kit_id: app_kit_id, name: name};
    request({
        method: 'PUT', uri: MY_APP_KITS,
        headers: {
            "X-Auth-Token": x_token,
            "X-User-Id": user_id,
            'content-type': 'application/json'
        },
        body: JSON.stringify(jsonData)
    }).on('data', function (data) {
        console.log('Response MyAppKit: ' + data);

        var ret = JSON.parse(data);
        device_id = ret._id;
        console.log('Response MyAppKit Id: ',  device_id);

        //getDataEvents(device_id);
        //getControlEvents(device_id);
        //getDataVisualization(device_id, "h");

        // postControlEvents(device_id, "Status", "true");
    });
};

var getMyAppKits = function () {
    return request({
        method: 'GET', uri: MY_APP_KITS,
        headers: {
            "X-Auth-Token": x_token,
            "X-User-Id": user_id
        },
    }).on('data', function (data) {
        console.log('Response MyAppKits: ' + data);
        var ret = JSON.parse(data);

        for (var i in ret) {
            console.log('Response MyAppKit: ' + JSON.stringify(ret[i]));

            var device_id = ret[i]._id;

            getDataEvents(device_id);

            getControlEvents(device_id);

            getDataVisualization(device_id, "h");

            postControlEvents(device_id, "Status", "true");
        }
    });
};

var getDataEvents = function (device_id) {
    console.log('Response getDataEvents: ' + device_id);

    return request({
        method: 'GET', uri: DATA_EVENTS + "/" + device_id,
        headers: {
            "X-Auth-Token": x_token,
            "X-User-Id": user_id
        },
    }).on('data', function (data) {
        console.log('Response Data: ' + device_id + " => " + data);
    });
};

/**
 * @param device_id
 * @param period : period is "h", "d", "w", means 从前一小时 :00 至今，从前一日 0:00 至今， 从前一周的周一 0:00 至今
 * @returns {*}
 */
var getDataVisualization = function (device_id, period) {
    console.log('Response getDataVisualization: ' + device_id + " / " + period);

    return request({
        method: 'GET', uri: DATA_VISUAL + "/" + device_id + "/" + period,
        headers: {
            "X-Auth-Token": x_token,
            "X-User-Id": user_id
        },
    }).on('data', function (data) {
        console.log('Response Data Visualization: ' + data);
    });
};

var getControlEvents = function (device_id) {
    console.log('Response getControlEvents: ' + device_id);
    return request({
        method: 'GET', uri: CONTROL_EVENTS + "/" + device_id,
        headers: {
            "X-Auth-Token": x_token,
            "X-User-Id": user_id
        },
    }).on('data', function (data) {
        console.log('Response Control: '  + device_id + " => " +  data);
    });
};

var postControlEvents = function (device_id, control_name, control_value) {
    var jsonData = {device_id: device_id, control_name: control_name, control_value: control_value};
    request({
        method: 'POST', uri: CONTROL_EVENTS,
        headers: {
            "X-Auth-Token": x_token,
            "X-User-Id": user_id,
            'content-type': 'application/json'
        },
        body: JSON.stringify(jsonData)
    }).on('data', function (data) {
        console.log('Response Control Event: ' + data);
        getControlEvents(device_id);
    });
};

//var postDataEvents = function (token, device_id, data_name, data_value) {
//    var jsonData = {device_id: device_id, data_name: data_name, data_value: data_value};
//    return request({
//        method: 'POST',  uri: DATA_EVENTS,
//        headers:{
//            "x-token": token
//        },
//        body: JSON.stringify(jsonData)
//    }).on('data', function (data) {
//        console.log('Response Data Event: ' + data);
//        getDataEvents(device_id);
//    });
//};

login(useremail, pwd);
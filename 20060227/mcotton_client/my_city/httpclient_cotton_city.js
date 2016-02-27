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

var CITY_DATA_EVENTS = API_VER + "/de_city";
var CITY_DATA_VISUAL = API_VER + "/vis_city";

var user_id = null, x_token = null;

var project_city, myappkit_city, project_id, device_id;
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
        console.log('Response Projects: ' + data);
        var ret = JSON.parse(data);

        for (var i in ret) {
            console.log('Response Project: ' + JSON.stringify(ret[i]));
        }

        project_city = _.findWhere(ret , {name: 'Smart City'});
        console.log('Response Project: ' + JSON.stringify(project_city));

        project_id = project_city._id;

        // Create new Device
        if (x_token) {
            getDevices();
        }
    });
};

var getDevices = function () {
    return request({
        method: 'GET', uri: MY_APP_KITS,
        headers: {
            "X-Auth-Token": x_token,
            "X-User-Id": user_id
        },
    }).on('data', function (data) {
        // console.log('Response MyAppKits: ' + data);
        var ret = JSON.parse(data);

        for (var i in ret) {
            var device_id = ret[i]._id;

            if (ret[i].project_id == project_id) {
                console.log('Response Devices: ' + JSON.stringify(ret[i]));

                getCityDataEvents(device_id);
                getCityVisualization(device_id);
            }
        }
    });
};

var getCityDataEvents = function (device_id) {
    //console.log('Response getCityDataEvents: ' + device_id);

    return request({
        method: 'GET', uri: CITY_DATA_EVENTS + "/" + device_id,
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
 * @returns {*}
 */
var getCityVisualization = function (device_id) {
    //console.log('Response getCityVisualization: ' + device_id);

    return request({
        method: 'GET', uri: CITY_DATA_VISUAL + "/" + device_id,
        headers: {
            "X-Auth-Token": x_token,
            "X-User-Id": user_id
        },
    }).on('data', function (data) {
        console.log('Response City Visualization: ' + device_id + " => " + data);
    });
};

login(useremail, pwd);
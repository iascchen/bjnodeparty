/**
 * Created by chenhao on 15/4/16.
 */

var request = require('request'),
    _ = require('underscore');

var host = "localhost", port = 3000;
// var host = "192.168.1.240", port = 3000;
// var host = "mcotton.microduino.cn", port = 80;

var API = "http://" + host + ":" + port + "/api";
var LOGIN = API + "/login";

var jsonData;
var useremail = "iasc@163.com", pwd = "123456";

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

            // Add more actions
        }
    });
};

login(useremail, pwd);
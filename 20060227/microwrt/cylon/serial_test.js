/**
 * Created by chenhao on 15/6/4.
 */
var serialport = require("serialport");
var SerialPort = serialport.SerialPort; // localize object constructor

//serialport.list(function (err, ports) {
//    ports.forEach(function(port) {
//        console.log(port.comName);
//        console.log(port.pnpId);
//        console.log(port.manufacturer);
//    });
//});

var serial = new SerialPort("/dev/ttyS0", {
    baudrate: 9600,
    parser: serialport.parsers.readline("\n")
}, false);

console.log("Start");

serial.on("open", function () {
    console.log('opened');

    serial.write("a");

    serial.on('data', function(data) {
        console.log('data received: ' + data);
    });
});

serial.on('error', function(err) {
    console.log('error: '+err);
});

serial.open();

setTimeout(function () {
    // observer.stop();
    serial.close();
}, 1000);
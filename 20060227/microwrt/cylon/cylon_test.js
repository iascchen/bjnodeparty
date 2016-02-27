var Cylon = require("cylon");

// Initialize the robot
Cylon.robot({
    // Change the port to the correct port for your Arduino.
    connections: {
        arduino: {
            adaptor: 'firmata',
            // port: '/dev/tty.usbserial-A900EHNI'
            port: '/dev/ttyS0'
        }
    },

    devices: {
        led: {driver: 'led', pin: 10}
    },

    work: function (my) {
        every((1).second(), function () {
            my.led.toggle();
        });
    }
}).start();

var Cylon = require('cylon');

Cylon.robot({
    connections: {
        arduino: {
            adaptor: 'firmata',
            port: '/dev/ttyS0'
        }
    },

    devices: {
        button: {driver: 'button', pin: 9},
        led: {driver: 'led', pin: 10}
    },

    work: function (my) {
        my.button.on('push', function () {
            console.log("Button pushed!");
            my.led.toggle();
        });
        my.button.on('release', function () {
            console.log("Button released!");
            my.led.toggle();
        });
    }
}).start();
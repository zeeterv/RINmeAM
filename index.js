const fs = require('fs');
const path = require('path');
const pm2 = require('pm2');

global.Promise = require('bluebird');

require('longjohn');
require('dotenv-safe').config({
    path: path.join(__dirname, '.env'),
    allowEmptyValues: true
});

!fs.existsSync('./logs') && fs.mkdirSync('./logs');

const processCount = parseInt(process.env.CLIENT_PROCESSES);

process.on('unhandledRejection', (r, p) => {
    r && console.error('Unhandled Rejection:', p, 'reason', r.message);
});

pm2.launchBus((error, bus) => {
    if (error) {
        console.error(error);
    }

    bus.on('process:msg', (packet) => {
        const data = packet.raw;
        const payload = {
            op: data.op,
            d: data.d,
            origin: packet.process.pm_id % processCount,
            code: data.code
        }

        if (data.dest === -1) {
            for (let i = 0; i < processCount; i++) {
                pm2.sendDataToProcessId(i, {
                    type: 'process:msg',
                    data: payload,
                    topic: 'broadcast'
                }, (error) => error && console.error(error));
            }
        } else {
            pm2.sendDataToProcessId(data.dest, {
                type: 'process.msg',
                data: payload,
                topic: 'relay'
            }, (error) => error && console.error(error));
        }
    });
});

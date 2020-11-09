const { Client } = require('sylphy');
const Database = require('./plugins/Database.js');
const pkg = require('../package.json');

class SatomiClient extends Client {
    constructor(options = {}) {
        super(options);
        this.botVersion = `v${pkg.version}`;
        this.satomiColor = 0x98ffa6;
        this.redColor = 0xff4b4b;
        this.blueColor = 0x99dff;
        this.nsfwColor = 0xffd1dc;
        this.redditColor = 0xcee3f8;
        this.userAgent = `Satomi (https://github.com/kyostra/satomi) v(${pkg.version})`;
        this.mongodb = new Database({
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            dbname: process.env.DB_DBNAME
        });
    }
}

module.exports = SatomiClient;

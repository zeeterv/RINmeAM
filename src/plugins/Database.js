const Mongoose = require('mongoose');
const chalk = require('chalk');

const RoleModel = require('../models/Role.js');
const UserModel = require('../models/User.js');
const GuildModel = require('../models/Guild.js');

class Database {
    constructor(options={}) {
        this.URI = `mongodb://${options.username}:${options.password}@${options.host}:${options.port}/${options.dbname}`;
        this.models = { roles: RoleModel, users: UserModel, guilds: GuildModel };
        this.cache = { roles: {}, users: {}, guilds: {} };
    }

    load(satomi) {
        return new Promise((resolve, reject) => {
            this.satomi = satomi;
            Mongoose.Promise = global.Promise;
            Mongoose.connect(this.URI, { useNewUrlParser: true }).catch((error) => {
                return reject(error);
            });
            Mongoose.set('useFindAndModify', false);
            Mongoose.set('useCreateIndex', true);
            Mongoose.set('useUnifiedTopology', true);
            Mongoose.connection.on('error', (error) => this.satomi.logger.error(chalk.red.bold(`[DB] Mongoose error: ${error}`)));
            Mongoose.connection.once('open', () => this.satomi.logger.info(chalk.green.bold('[DB] Mongoose Connected')));
            return resolve(this);
        });
    }

    destroy() {
        return new Promise((resolve, reject) => {
            this.satomi = undefined;
            Mongoose.disconnect().catch((error) => {
                return reject(error);
            });
            Mongoose.connection.removeAllListeners('error');
            Mongoose.connection.removeAllListeners('open');
            return resolve();
        });
    }
}

module.exports = Database;

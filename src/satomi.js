// const { Client } = require('sylphy');
const SatomiClient = require('./satomiClient.js');
const chalk = require('chalk');
const { createLogger, format, transports } = require('winston');
const { colorize, combine, timestamp, label, printf } = format;
const moment = require('moment');
const fs = require('fs');
const path = require('path');

global.Promise = require('bluebird');
require('longjohn');
require('dotenv-safe').config({
    path: path.join(process.cwd(), '.env'),
    allowEmptyValues: true
});

const processCount = parseInt(process.env.CLIENT_PROCESSES, 10);
const processID = parseInt(process.env.NODE_APP_INSTANCE, 10) % processCount;
const processShards = parseInt(process.env.CLIENT_SHARDS_PER_PROCESS || 1, 10);
const firstShardID = processID * processShards;
const lastShardID = firstShardID + processShards - 1;
const maxShards = processShards * processCount;

const resolve = (str) => path.join('src', str);

const satomiFormat = printf((info) => {
    return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
});

const logger = createLogger({
    level: 'silly',
    format: combine(
        colorize(),
        label({ label: processShards > 1 ? `C ${firstShardID}-${lastShardID}` : `C ${processID}` }),
        timestamp(`[${chalk.magenta(moment().format('YYYY MMM Do, h:mm:ss a'))}]`),
        satomiFormat
    ),
    transports: [new transports.Console()]
});

const satomi = new SatomiClient({
    token: process.env.CLIENT_TOKEN,
    prefix: process.env.CLIENT_PREFIX,
    admins: process.env.ADMIN_IDS.split(', '),
    modules: resolve('modules'),
    messageLimit: 151,
    getAllUsers: true,
    disableEveryone: false,
    maxShards: maxShards,
    firstShardID: firstShardID,
    lastShardID: lastShardID,
    autoreconnect: true
});

const cmdpath = resolve('commands');
satomi.unregister('logger', 'console');
satomi.register('logger', 'winston', logger);
satomi.unregister('middleware', true);
satomi.register('middleware', resolve('middleware'));
satomi.register('commands', cmdpath, { groupedCommands: true });

satomi.on('ready', () => {
    const shards = satomi.shards.size;
    const guilds = satomi.guilds.size;
    const users = satomi.users.size;

    /* Status types for Discord Bots
    * 0 = Playing
    * 1 = Twitch
    * 2 = Listening to
    * 3 = Watching
    */
    const statuses = [
        { type: 0, name: 'type s.help for help' },
        { type: 3, name: 'you type' },
        { type: 0, name: 'the saxophone' },
        { type: 2, name: 'your voices' },
        { type: 3, name: 'some lewdies' },
        { type: 0, name: 'a fun game' },
        { type: 3, name: 'anime' },
        { type: 0, name: 'the piano' },
        { type: 0, name: 'with cute girls' },
        { type: 0, name: 'the violin' },
        { type: 3, name: 'you struggle' },
        { type: 0, name: 'with catgirls' },
        { type: 0, name: `with ${users} users` },
        { type: 2, name: `to ${users} users` },
        { type: 3, name: `${users} users` },
        { type: 0, name: `in ${guilds} servers` },
        { type: 3, name: `${guilds} servers` }
    ];

    satomi.ascii = () => {
        fs.readFile('./res/boot/ascii.txt', 'utf-8', (err, data) => {
            if (err) {
                console.log(err);
            }
            console.log(data);
        });
    };

    satomi.ascii();

    satomi.logger.info(`${chalk.red.bold(satomi.user.username)} - ${
        firstShardID === lastShardID
        ? `Shard ${firstShardID} is ready!`
        : `Shards ${firstShardID} to ${lastShardID} are ready!`
    }`);

    satomi.logger.info(
        `Shards: ${chalk.cyan.bold(shards)} | ` +
        `Guilds: ${chalk.cyan.bold(guilds)} | ` +
        `Users: ${chalk.cyan.bold(users)}`
    );

    try {
        satomi.mongodb.load(satomi);
    } catch (err) {
        satomi.logger.error(chalk.red.bold(`[Mongoose]: ${err}`));
    }

    satomi.logger.info(chalk.yellow.bold(`Prefix: ${satomi.prefix}`));
    satomi.logger.info(chalk.green.bold('Satomi Is Ready To Rumble~!'));

    satomi.changeStatus = () => {
        const chooseStatus = statuses[~~(Math.random() * statuses.length)];
        satomi.editStatus({ name: chooseStatus.name, type: chooseStatus.type || 0 });
        satomi.logger.info(chalk.yellow.bold(`Satomi's status changed to -"${chooseStatus.name}"`));
    };

    setInterval(() => satomi.changeStatus(), 120000);
});

satomi.on('error', satomi.logger.error);

process.once('SIGINT', () => {
    satomi.logger.error('Recieved SIGINT');
    if (satomi) {
        try {
            satomi.mongodb.destroy();
            satomi.disconnect();
        } catch (error) {
            satomi.logger.error(error);
        }
    }
    process.exit(0);
});
process.on('uncaughtException', (err, origin) => {
    satomi.logger.error('Caught Exception: ', err.stack, 'Exception origin: ', origin);
    process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => reason && satomi.logger.error('Unhandled Rejection: ', promise, 'reason: ', reason.message));

satomi.run();

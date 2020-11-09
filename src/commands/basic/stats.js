const { Command } = require('sylphy');
const moment = require('moment');
const pkg = require('../../../package.json');

class Stats extends Command {
    constructor (...args) {
        super(...args, {
            name: 'stats',
            group: 'basic',
            cooldown: 10,
            options: { guildOnly: true }
        });
    }

    handle ({ client }, responder) {
        return responder.send(' ', { embed: {
            color: client.satomiColor,
            author: {
                name: 'Satomi Stats~',
                icon_url: `${client.user.avatarURL}`
            },
            thumbnail: {
                url: `${client.user.avatarURL}`
            },
            fields: [{
                name: 'Uptime',
                value: `${moment.utc(client.uptime).format('DDD[d] HH[h] mm[m] ss[s]')}`,
                inline: true
            },
            {
                name: 'Memory Usage',
                value: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} mb`,
                inline: true
            },
            {
                name: 'Version(s)',
                value: `satomi: ${pkg.version}` +
                `\neris: ${pkg.dependencies.eris}` +
                `\nsylphy: ${pkg.dependencies.sylphy}`,
                inline: true
            },
            {
                name: 'Satomi serves...',
                value: `Shards: ${client.shards.size}` +
                `\nServers: ${client.guilds.size}` +
                `\nUsers: ${client.users.size}`,
                inline: true
            }],
            timestamp: new Date()
        } }).catch(this.logger.error);
    }
}

module.exports = Stats;

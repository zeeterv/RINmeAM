const { Command } = require('sylphy');

class Purge extends Command {
    constructor (...args) {
        super (...args, {
            name: 'purge',
            group: 'moderation',
            aliases: ['clear', 'delete'],
            cooldown: 2,
            options: { guildOnly: true, requirements: { permissions: { manageMessages: true } } },
            usage: [
                { name: 'limit', displayName: 'limit', type: 'int', min: 1, max: 51 },
                { name: 'options',
                    displayName: 'keyword | bots | commands | @user | unpinned',
                    type: 'list',
                    separator: ' | ',
                    optional: true,
                    last: true,
                    unique: true
                }
            ]
        });
    }

    createFilter (val) {
        switch (val) {
            case 'bots': return (msg) => msg.author.bot;
            case 'commands': return (msg) => msg.content.startsWith(process.env.CLIENT_PREFIX);
            case 'unpinned': return (msg) => !msg.pinned;
            default: {
                const isMember = val.match(/^<@!?(\d{17,18})>$/) || val.match(/^(\d{17,18})$/);
                if (isMember) {
                    return (msg) => msg.author.id === isMember[1];
                }
                return (msg) => msg.cleanContent.includes(val);
            }
        }
    }

    handle ({ args, client, msg }, responder) {
        const limit = args.limit + 1;
        const options = args.options;
        let success = 0;
        const opts = Array.isArray(options) ? options : [options];

        if (limit > 51) {
            return responder.send(' ', { embed: {
                color: client.redColor,
                description: ':x: Message count too high! Max is 50'
            } }).catch(this.logger.error);
        }

        options ? client.purgeChannel(msg.channel.id, limit, m => {
            if (success >= limit) {
                return false;
            }
            for (const filter of opts.map(this.createFilter)) {
                if (filter(m)) {
                    success++;
                    return true;
                }
            }
        }).catch((error) => {
            responder.send(' ', { embed: {
                color: client.redColor,
                description: `There was an error trying to purge: ${error}`
            } }).catch(this.logger.error);
        }) : client.purgeChannel(msg.channel.id, limit).catch((error) => {
            responder.send(' ', { embed: {
                color: client.redColor,
                description: `There was an error trying to purge: ${error}`
            } }).catch(this.logger.error);
        });
    }
}

module.exports = Purge;

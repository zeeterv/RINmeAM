const { Command } = require('sylphy');

class Poll extends Command {
    constructor(...args) {
        super(...args, {
            name: 'poll',
            group: 'moderation',
            cooldown: 2,
            options: { guildOnly: true, requirements: { permissions: { manageMessages: true } } },
            usage: [
                { name: 'phrase', displayName: 'phrase', type: 'string', optional: false, last: true }
            ]
        });
    }

    handle ({ args, client, msg }, responder) {
        const phrase = args.phrase;

        return responder.send(' ', { embed: {
            color: client.satomiColor,
            title: `Poll Started! by - ${msg.author.username}#${msg.author.discriminator}`,
            description: phrase,
            timestamp: new Date()
        } }).catch(this.logger.error);
    }
}

module.exports = Poll;

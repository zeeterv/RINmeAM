const { Command } = require('sylphy');
const aesthetics = require('aesthetics');

class Aesthetic extends Command {
    constructor (...args) {
        super (...args, {
            name: 'aesthetic',
            group: 'fun',
            cooldown: 2,
            options: { guildOnly: true },
            usage: [
                { name: 'phrase', displayName: 'phrase', type: 'string', optional: true, last: true }
            ]
        });
    }

    handle ({ args, client, msg }, responder) {
        const phrase = args.phrase;

        if (!phrase) {
            return responder.send(' ', { embed: {
                color: client.redColor,
                title: 'Aesthetic Error',
                description: 'please provide a word or phrase to aesthetic-ify ^~^'
            } }).catch(this.logger.error);
        }

        return responder.send(`${msg.author.mention} ${aesthetics(phrase)}`).catch(this.logger.error);
    }
}

module.exports = Aesthetic;

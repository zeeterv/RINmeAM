const { Command } = require('sylphy');
const urban = require('urban');

class Urban extends Command {
    constructor (...args) {
        super (...args, {
            name: 'urban',
            group: 'fun',
            cooldown: 5,
            options: { guildOnly: true },
            usage: [
                { name: 'word', displayName: 'word', type: 'string', optional: true, last: true }
            ]
        });
    }

    handle ({ args, client }, responder) {
        const word = args.word;

        if (!word) {
            urban.random().first((json) => {
                return responder.send(' ', { embed: {
                    author: {
                        name: `Random Urban Dictionary Word! (${json.word})`,
                        url: json.permalink,
                        icon_url: 'https://pbs.twimg.com/profile_images/838627383057920000/m5vutv9g_400x400.jpg'
                    },
                    color: client.satomiColor,
                    description: json.definition,
                    url: json.permalink,
                    timestamp: new Date()
                } }).catch(this.logger.error);
            });
        }

        if (word) {
            urban(word).first((json) => {
                if (json === undefined) {
                    return responder.send(' ', { embed: {
                        title: ':x: there was an issue finding that word, try again~'
                    } });
                }

                return responder.send(' ', { embed: {
                    author: {
                        name: `Definition of ${json.word}`,
                        url: json.permalink,
                        icon_url: 'https://pbs.twimg.com/profile_images/838627383057920000/m5vutv9g_400x400.jpg'
                    },
                    color: client.satomiColor,
                    description: json.definition,
                    url: json.permalink,
                    timestamp: new Date()
                } }).catch(this.logger.error);
            });
        }
    }
}

module.exports = Urban;

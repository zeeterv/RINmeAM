const { Command } = require('sylphy');

class Owo extends Command {
    constructor (...args) {
        super (...args, {
            name: 'owo',
            group: 'fun',
            aliases: ['uwu'],
            cooldown: 2,
            options: { guildOnly: true },
            usage: [
                { name: 'phrase', displayName: 'phrase', type: 'string', optional: true, last: true }
            ]
        });
    }

    handle ({ args, client, msg }, responder) {
        const faces = ['(*^ω^)', '(◕‿◕✿)', '(◕ᴥ◕)', 'ʕ•ᴥ•ʔ', 'ʕ￫ᴥ￩ʔ', '(*^.^*)', 'owo', '(｡♥‿♥｡)', 'uwu', '(*￣з￣)', '>w<', '^w^', '(つ✧ω✧)つ', '(/ =ω=)/'];
        const phrase = args.phrase;

        if (!phrase) {
            return responder.send(' ', { embed: {
                color: client.redColor,
                title: 'OwO Error',
                description: 'please provide a word or phrase to owo uwu ^~^'
            } }).catch(this.logger.error);
        }

        const owoPhrase = string => {
            while (string.match(/!+/)) {
                string = string.replace(/!+/, ` ${faces[Math.floor(Math.random() * faces.length)]} `);
            }

            return string
                .replace(/(?:l|r)/g, 'w')
                .replace(/(?:L|R)/g, 'W')
                .replace(/n([aeiou])/g, 'ny$1')
                .replace(/N([aeiou])/g, 'Ny$1')
                .replace(/N([AEIOU])/g, 'NY$1')
                .replace(/ove/g, 'uv')
                .replace(/OVE/g, 'UV');
        };

        return responder.send(`${msg.author.mention} ${owoPhrase(phrase)}`).catch(this.logger.error);
    }
}

module.exports = Owo;

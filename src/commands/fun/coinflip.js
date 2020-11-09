const { Command } = require('sylphy');

class Coinflip extends Command {
    constructor (...args) {
        super(...args, {
            name: 'coinflip',
            group: 'fun',
            cooldown: 2,
            options: { guildOnly: true },
            usage: [
                { name: 'guess', displayName: 'guess', type: 'string', optional: true, last: true }
            ]
        });
    }

    handle ({ args, client, msg }, responder) {
        const guess = args.guess;

        const coins = [
            { name: 'heads!' },
            { name: 'tails!' }
        ];

        const coin = coins[~~(Math.random() * coins.length)];

        if (guess) {
            if (coin.name === 'heads!') {
                return responder.send(' ', { embed: {
                    color: client.satomiColor,
                    title: `${msg.author.username} guessed ${guess}`,
                    description: `and it landed on... ${coin.name}`,
                    image: {
                        url: 'https://files.catbox.moe/a8k66v.png'
                    },
                    timestamp: new Date()
                } }).catch(this.logger.error);
            }

            if (coin.name === 'tails!') {
                return responder.send(' ', { embed: {
                    color: client.satomiColor,
                    title: `${msg.author.username} guessed ${guess}`,
                    description: `and it landed on... ${coin.name}`,
                    image: {
                        url: 'https://files.catbox.moe/j57z7u.png'
                    },
                    timestamp: new Date()
                } }).catch(this.logger.error);
            }
        }

        if (!guess) {
            if (coin.name === 'heads!') {
                return responder.send(' ', { embed: {
                    color: client.satomiColor,
                    title: `${msg.author.username} flipped a coin!`,
                    description: `and it landed on... ${coin.name}`,
                    image: {
                        url: 'https://files.catbox.moe/a8k66v.png'
                    },
                    timestamp: new Date()
                } }).catch(this.logger.error);
            }

            if (coin.name === 'tails!') {
                return responder.send(' ', { embed: {
                    color: client.satomiColor,
                    title: `${msg.author.username} flipped a coin!`,
                    description: `and it landed on... ${coin.name}`,
                    image: {
                        url: 'https://files.catbox.moe/j57z7u.png'
                    },
                    timestamp: new Date()
                } }).catch(this.logger.error);
            }
        }
    }
}

module.exports = Coinflip;

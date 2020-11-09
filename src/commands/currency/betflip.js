const { Command } = require('sylphy');

class BetFlip extends Command {
    constructor (...args) {
        super(...args, {
            name: 'betflip',
            group: 'currency',
            aliases: ['bf'],
            cooldown: 3,
            options: { guildOnly: true },
            usage: [
                { name: 'amount', displayName: 'amount', type: 'int', optional: true, last: false },
                { name: 'guess', displayName: 'guess', type: 'string', choices: ['h', 't', 'heads', 'tails'], optional: true, last: true }
            ]
        });
    }

    handle ({ args, client, msg }, responder) {
        const amount = args.amount;
        const guess = args.guess;

        const coins = [
            { name: 'heads!' },
            { name: 'tails!' }
        ];

        const coin = coins[~~(Math.random() * coins.length)];
        const newAmountRight = amount * 2;
        const newAmountWrong = Math.round(amount * 1.5);

        if (coin.name === 'heads!') {
            if (guess === 'h' || guess === 'heads') {
                client.mongodb.models.users.findOne({ serverID: msg.channel.guild.id, userID: msg.author.id }, (error, u) => {
                    if (error || !u) {
                        return responder.send(`${msg.author.mention} couldn't find Guild or User (BOTS HAVE NO PROFILES)`, { embed: {
                            color: client.redColor,
                            title: 'BetFlip.Find Error',
                            description: `${error}`,
                            timestamp: new Date()
                        } }).catch(this.logger.error);
                    }

                    client.mongodb.models.users.findOneAndUpdate({ serverID: msg.channel.guild.id, userID: msg.author.id }, { $set: { currency: u.currency += newAmountRight } }, (error, uu) => {
                        if (error || !uu) {
                            return responder.send(`${msg.author.mention} couldn't find Guild or User (BOTS HAVE NO PROFILES)`, { embed: {
                                color: client.redColor,
                                title: 'BetFlip.Find Error',
                                description: `${error}`,
                                timestamp: new Date()
                            } }).catch(this.logger.error);
                        }

                        return responder.send(' ', { embed: {
                            color: client.satomiColor,
                            description: `${msg.author.mention} You guessed it right! You won ￥${newAmountRight}`,
                            image: {
                                url: 'https://files.catbox.moe/a8k66v.png'
                            }
                        } }).catch(this.logger.error);
                    }).catch(this.logger.error);
                }).catch(this.logger.error);
            }

            if (guess === 't' || guess === 'tails') {
                client.mongodb.models.users.findOne({ serverID: msg.channel.guild.id, userID: msg.author.id }, (error, u) => {
                    if (error || !u) {
                        return responder.send(`${msg.author.mention} couldn't find Guild or User (BOTS HAVE NO PROFILES)`, { embed: {
                            color: client.redColor,
                            title: 'BetFlip.Find Error',
                            description: `${error}`,
                            timestamp: new Date()
                        } }).catch(this.logger.error);
                    }

                    client.mongodb.models.users.findOneAndUpdate({ serverID: msg.channel.guild.id, userID: msg.author.id }, { $set: { currency: u.currency -= newAmountWrong } }, (error, uu) => {
                        if (error || !uu) {
                            return responder.send(`${msg.author.mention} couldn't find Guild or User (BOTS HAVE NO PROFILES)`, { embed: {
                                color: client.redColor,
                                title: 'BetFlip.Find Error',
                                description: `${error}`,
                                timestamp: new Date()
                            } }).catch(this.logger.error);
                        }

                        return responder.send(' ', { embed: {
                            color: client.redColor,
                            description: `${msg.author.mention} You guessed it wrong! You lost ￥${newAmountWrong}`,
                            image: {
                                url: 'https://files.catbox.moe/a8k66v.png'
                            }
                        } }).catch(this.logger.error);
                    }).catch(this.logger.error);
                }).catch(this.logger.error);
            }
        }

        if (coin.name === 'tails!') {
            if (guess === 't' || guess === 'tails') {
                client.mongodb.models.users.findOne({ serverID: msg.channel.guild.id, userID: msg.author.id }, (error, u) => {
                    if (error || !u) {
                        return responder.send(`${msg.author.mention} couldn't find Guild or User (BOTS HAVE NO PROFILES)`, { embed: {
                            color: client.redColor,
                            title: 'BetFlip.Find Error',
                            description: `${error}`,
                            timestamp: new Date()
                        } }).catch(this.logger.error);
                    }

                    client.mongodb.models.users.findOneAndUpdate({ serverID: msg.channel.guild.id, userID: msg.author.id }, { $set: { currency: u.currency += newAmountRight } }, (error, uu) => {
                        if (error || !uu) {
                            return responder.send(`${msg.author.mention} couldn't find Guild or User (BOTS HAVE NO PROFILES)`, { embed: {
                                color: client.redColor,
                                title: 'BetFlip.Find Error',
                                description: `${error}`,
                                timestamp: new Date()
                            } }).catch(this.logger.error);
                        }

                        return responder.send(' ', { embed: {
                            color: client.satomiColor,
                            description: `${msg.author.mention} You guessed it right! You won ￥${newAmountRight}`,
                            image: {
                                url: 'https://files.catbox.moe/j57z7u.png'
                            }
                        } }).catch(this.logger.error);
                    }).catch(this.logger.error);
                }).catch(this.logger.error);
            }

            if (guess === 'h' || guess === 'heads') {
                client.mongodb.models.users.findOne({ serverID: msg.channel.guild.id, userID: msg.author.id }, (error, u) => {
                    if (error || !u) {
                        return responder.send(`${msg.author.mention} couldn't find Guild or User (BOTS HAVE NO PROFILES)`, { embed: {
                            color: client.redColor,
                            title: 'BetFlip.Find Error',
                            description: `${error}`,
                            timestamp: new Date()
                        } }).catch(this.logger.error);
                    }

                    client.mongodb.models.users.findOneAndUpdate({ serverID: msg.channel.guild.id, userID: msg.author.id }, { $set: { currency: u.currency -= newAmountWrong } }, (error, uu) => {
                        if (error || !uu) {
                            return responder.send(`${msg.author.mention} couldn't find Guild or User (BOTS HAVE NO PROFILES)`, { embed: {
                                color: client.redColor,
                                title: 'BetFlip.Find Error',
                                description: `${error}`,
                                timestamp: new Date()
                            } }).catch(this.logger.error);
                        }

                        return responder.send(' ', { embed: {
                            color: client.redColor,
                            description: `${msg.author.mention} You guessed it wrong! You lost ￥${newAmountWrong}`,
                            image: {
                                url: 'https://files.catbox.moe/j57z7u.png'
                            }
                        } }).catch(this.logger.error);
                    }).catch(this.logger.error);
                }).catch(this.logger.error);
            }
        }
    }
}

module.exports = BetFlip;

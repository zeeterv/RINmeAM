const { Command } = require('sylphy');

class BetRoll extends Command {
    constructor (...args) {
        super(...args, {
            name: 'betroll',
            group: 'currency',
            aliases: ['br'],
            cooldown: 3,
            options: { guildOnly: true },
            usage: [
                { name: 'amount', displayName: 'amount', type: 'int', optional: true, last: true }
            ]
        });
    }

    handle ({ args, client, msg }, responder) {
        const amount = args.amount;
        const rollNumber = Math.floor(Math.random() * (100 - 0 + 1)) + 0;

        let newAmount;
        if (rollNumber <= 55) {
            newAmount = amount * 3;
        } else if (rollNumber >= 56 && rollNumber <= 61) {
            newAmount = amount * 2;
        } else if (rollNumber >= 62 && rollNumber <= 99) {
            newAmount = Math.round(amount * 2.5);
        } else if (rollNumber === 100) {
            newAmount = amount * 4;
        }

        client.mongodb.models.users.findOne({ serverID: msg.channel.guild.id, userID: msg.author.id }, (error, u) => {
            if (error || !u) {
                return responder.send(`${msg.author.mention} couldn't find Guild or User (BOTS HAVE NO PROFILES)`, { embed: {
                    color: client.redColor,
                    title: 'BetRoll.Find Error',
                    description: `${error}`,
                    timestamp: new Date()
                } }).catch(this.logger.error);
            }

            if (rollNumber <= 60) {
                client.mongodb.models.users.findOneAndUpdate({ serverID: msg.channel.guild.id, userID: msg.author.id }, { $set: { currency: u.currency -= newAmount } }, (error, uu) => {
                    if (error || !uu) {
                        return responder.send(`${msg.author.mention} couldn't find Guild or User (BOTS HAVE NO PROFILES)`, { embed: {
                            color: client.redColor,
                            title: 'BetRoll.Find Error',
                            description: `${error}`,
                            timestamp: new Date()
                        } }).catch(this.logger.error);
                    }

                    return responder.send(' ', { embed: {
                        color: client.redColor,
                        description: `${msg.author.mention} **rolled ${rollNumber}.** Better luck next time ﾍ(=￣∇￣)ﾉ`
                    } }).catch(this.logger.error);
                }).catch(this.logger.error);
            }

            if (rollNumber >= 61) {
                client.mongodb.models.users.findOneAndUpdate({ serverID: msg.channel.guild.id, userID: msg.author.id }, { $set: { currency: u.currency += newAmount } }, (error, uu2) => {
                    if (error || !uu2) {
                        return responder.send(`${msg.author.mention} couldn't find Guild or User (BOTS HAVE NO PROFILES)`, { embed: {
                            color: client.redColor,
                            title: 'BetRoll.Find Error',
                            description: `${error}`,
                            timestamp: new Date()
                        } }).catch(this.logger.error);
                    }

                    return responder.send(' ', { embed: {
                        color: client.satomiColor,
                        description: `${msg.author.mention} **rolled ${rollNumber}.** Congrats! You won ￥${newAmount} for rolling above 60`
                    } }).catch(this.logger.error);
                }).catch(this.logger.error);
            }
        }).catch(this.logger.error);
    }
}

module.exports = BetRoll;

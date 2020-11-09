const { Command } = require('sylphy');

class Give extends Command {
    constructor (...args) {
        super(...args, {
            name: 'give',
            group: 'currency',
            cooldown: 5,
            options: { guildOnly: true },
            usage: [
                { name: 'amount', displayName: 'amount', type: 'int', optional: true, last: false },
                { name: 'member', displayName: 'member', type: 'string', optional: true, last: true }
            ]
        });
    }

    handle ({ args, client, msg }, responder) {
        const amount = args.amount;
        const member = args.member;
        let user;

        if (!member) {
            return;
        } else if (member.length >= 17) {
            user = member;
        } else if (msg.mentions > 0) {
            user = msg.mentions[0].id;
        }

        client.mongodb.models.users.findOne({ serverID: msg.channel.guild.id, userID: msg.author.id }, (error, u) => {
            if (error || !u) {
                return responder.send(`${msg.author.mention} couldn't find Guild or User (BOTS HAVE NO PROFILES)`, { embed: {
                    color: client.redColor,
                    title: 'Give.Find Error',
                    description: `${error}`,
                    timestamp: new Date()
                } }).catch(this.logger.error);
            }

            client.mongodb.models.users.findOneAndUpdate({ serverID: msg.channel.guild.id, userID: msg.author.id }, { $set: { currency: u.currency -= amount } }, (error, uu) => {
                if (error || !uu) {
                    return responder.send(`${msg.author.mention} couldn't find Guild or User (BOTS HAVE NO PROFILES)`, { embed: {
                        color: client.redColor,
                        title: 'Give.Find Error',
                        description: `${error}`,
                        timestamp: new Date()
                    } }).catch(this.logger.error);
                }

                client.mongodb.models.users.findOne({ serverID: msg.channel.guild.id, userID: user }, (error, u2) => {
                    if (error || !u2) {
                        return responder.send(`${msg.author.mention} couldn't find Guild or User (BOTS HAVE NO PROFILES)`, { embed: {
                            color: client.redColor,
                            title: 'Give.Find Error',
                            description: `${error}`,
                            timestamp: new Date()
                        } }).catch(this.logger.error);
                    }

                    client.mongodb.models.users.findOneAndUpdate({ serverID: msg.channel.guild.id, userID: user }, { $set: { currency: u2.currency += amount } }, (error, uu2) => {
                        if (error || !uu2) {
                            return responder.send(`${msg.author.mention} couldn't find Guild or User (BOTS HAVE NO PROFILES)`, { embed: {
                                color: client.redColor,
                                title: 'Give.Find Error',
                                description: `${error}`,
                                timestamp: new Date()
                            } }).catch(this.logger.error);
                        }

                        let user2;
                        if (msg.mentions.length > 0) {
                            user2 = msg.channel.guild.members.get(msg.mentions[0].id);
                        } else if (member.length >= 17) {
                            user2 = msg.channel.guild.members.get(member);
                        } else {
                            user2 = msg.channel.guild.members.get(msg.member.id);
                        }

                        return responder.send(' ', { embed: {
                            color: client.satomiColor,
                            description: `${msg.author.mention} has gifted ￥${amount} to ${user2.mention}`
                        } }).catch(this.logger.error);
                    }).catch(this.logger.error);
                }).catch(this.logger.error);
            }).catch(this.logger.error);
        }).catch(this.logger.error);
    }
}

module.exports = Give;

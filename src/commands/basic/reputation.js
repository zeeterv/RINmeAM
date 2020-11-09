const { Command } = require('sylphy');
const moment = require('moment');

class Reputation extends Command {
    constructor (...args) {
        super(...args, {
            name: 'reputation',
            group: 'basic',
            aliases: ['rep'],
            cooldown: 10,
            options: { guildOnly: true },
            usage: [
                { name: 'member', displayName: 'member', type: 'string', optional: true, last: true }
            ]
        });
    }

    handle ({ args, client, msg }, responder) {
        const member = args.member;
        let user;

        if (!member) {
            return;
        } else if (member.length >= 17) {
            user = member;
        } else if (msg.mentions > 0) {
            user = msg.mentions[0].id;
        }

        if (member === msg.author.id || msg.mentions[0].id === msg.author.id) {
            return responder.send(`${msg.author.mention} You can't give yourself reputation`).catch(this.logger.error);
        }

        client.mongodb.models.users.findOne({ serverID: msg.channel.guild.id, userID: user }, (error, u) => {
            if (error || !u) {
                return responder.send(`${msg.author.mention} couldn't find Guild or User (BOTS HAVE NO PROFILES)`, { embed: {
                    color: client.redColor,
                    title: 'Reputation.Find Error',
                    description: `${error}`,
                    timestamp: new Date()
                } }).catch(this.logger.error);
            }

            if (moment().diff(u.currencyCD, 'hours', true) >= 23.00) {
                client.mongodb.models.users.findOneAndUpdate({ serverID: msg.channel.guild.id, userID: user }, { $set: { reputation: u.reputation + 1, reputationCD: new Date() } }, (error, uu) => {
                    if (error || !uu) {
                        return responder.send(`${msg.author.mention} couldn't find Guild or User (BOTS HAVE NO PROFILES)`, { embed: {
                            color: client.redColor,
                            title: 'Reputation.Find Error',
                            description: `${error}`,
                            timestamp: new Date()
                        } }).catch(this.logger.error);
                    }

                    return responder.send(' ', { embed: {
                        color: client.satomiColor,
                        description: `${msg.author.mention} You have given reputation to **${uu.userName}**, You can give more in 23 hours`
                    } }).catch(this.logger.error);
                }).catch(this.logger.error);
            } else {
                client.mongodb.models.users.findOne({ serverID: msg.channel.guild.id, userID: user }, (error, uuu) => {
                    if (error || !uuu) {
                        return responder.send(`${msg.author.mention} couldn't find Guild or User (BOTS HAVE NO PROFILES)`, { embed: {
                            color: client.redColor,
                            title: 'Reputation.Find Error',
                            description: `${error}`,
                            timestamp: new Date()
                        } }).catch(this.logger.error);
                    }

                    const ccd = moment(uuu.currencyCD);
                    const ccd2 = moment(ccd.add(23, 'hours'));
                    const timeToCD = ccd2.subtract(moment()).format('hh[h] mm[m] ss[s]');

                    return responder.send(' ', { embed: {
                        color: client.redColor,
                        description: `${msg.author.mention} You have already gave your daily reputation. You can give more in ${timeToCD}`
                    } }).catch(this.logger.error);
                }).catch(this.logger.error);
            }
        }).catch(this.logger.error);
    }
}

module.exports = Reputation;

const { Command } = require('sylphy');
const moment = require('moment');

class Daily extends Command {
    constructor (...args) {
        super(...args, {
            name: 'daily',
            group: 'currency',
            cooldown: 10,
            options: { guildOnly: true }
        });
    }

    handle ({ client, msg }, responder) {
        const ubi = 25;

        client.mongodb.models.users.findOne({ serverID: msg.channel.guild.id, userID: msg.author.id }, (error, u) => {
            if (error || !u) {
                return responder.send(`${msg.author.mention} couldn't find Guild or User (BOTS HAVE NO PROFILES)`, { embed: {
                    color: client.redColor,
                    title: 'Daily.Find Error',
                    description: `${error}`,
                    timestamp: new Date()
                } }).catch(this.logger.error);
            }

            if (moment().diff(u.currencyCD, 'hours', true) >= 23.00) {
                client.mongodb.models.users.findOneAndUpdate({ serverID: msg.channel.guild.id, userID: msg.author.id }, { $set: { currency: u.currency + ubi, currencyCD: new Date() } }, (error, uu) => {
                    if (error || !uu) {
                        return responder.send(`${msg.author.mention} couldn't find Guild or User (BOTS HAVE NO PROFILES)`, { embed: {
                            color: client.redColor,
                            title: 'Daily.Find Error',
                            description: `${error}`,
                            timestamp: new Date()
                        } }).catch(this.logger.error);
                    }

                    return responder.send(' ', { embed: {
                        color: client.satomiColor,
                        description: `${msg.author.mention} You have claimed your ￥25. You can claim again in 23 hours`
                    } }).catch(this.logger.error);
                }).catch(this.logger.error);
            } else {
                client.mongodb.models.users.findOne({ serverID: msg.channel.guild.id, userID: msg.author.id }, (error, uuu) => {
                    if (error || !uuu) {
                        return responder.send(`${msg.author.mention} couldn't find Guild or User (BOTS HAVE NO PROFILES)`, { embed: {
                            color: client.redColor,
                            title: 'Daily.Find Error',
                            description: `${error}`,
                            timestamp: new Date()
                        } }).catch(this.logger.error);
                    }

                    const ccd = moment(uuu.currencyCD);
                    const ccd2 = moment(ccd.add(23, 'hours'));
                    const timeToCD = ccd2.subtract(moment()).format('hh[h] mm[m] ss[s]');

                    return responder.send(' ', { embed: {
                        color: client.redColor,
                        description: `${msg.author.mention} You have already claimed your daily reward. You can claim again in ${timeToCD}`
                    } }).catch(this.logger.error);
                }).catch(this.logger.error);
            }
        }).catch(this.logger.error);
    }
}

module.exports = Daily;

/* eslint prefer-template: 0 */

const { Command } = require('sylphy');

class Leaderboard extends Command {
    constructor (...args) {
        super(...args, {
            name: 'leaderboard',
            group: 'currency',
            aliases: ['lb'],
            cooldown: 5,
            options: { guildOnly: true }
        });
    }

    handle ({ client, msg }, responder) {
        client.mongodb.models.users.find({ serverID: msg.channel.guild.id }, null, { sort: { currency: -1 } }, (error, u) => {
            if (error || !u) {
                return responder.send(`${msg.author.mention} couldn't find Guild or User (BOTS HAVE NO PROFILES)`, { embed: {
                    color: client.redColor,
                    title: 'Leaderboard.Find Error',
                    description: `${error}`,
                    timestamp: new Date()
                } }).catch(this.logger.error);
            }

            return responder.send(' ', { embed: {
                color: client.satomiColor,
                description: `Your ranking: #${u.findIndex(i => i.userID === msg.author.id) + 1}`,
                author: {
                    name: `${msg.channel.guild.name} Leaderboard`,
                    icon_url: msg.channel.guild.iconURL
                },
                fields: [{
                    name: `#1 ${u[0].userName} # ${u[0].userDisc}`,
                    value: `￥${u[0].currency}`,
                    inline: true
                },
                {
                    name: `#2 ${u[1] !== undefined ? u[1].userName + '#' + u[1].userDisc : 'Nobody'}`,
                    value: `￥${u[1] !== undefined ? u[1].currency : '0'}`,
                    inline: true

                },
                {
                    name: `#3 ${u[2] !== undefined ? u[2].userName + '#' + u[2].userDisc : 'Nobody'}`,
                    value: `￥${u[2] !== undefined ? u[2].currency : '0'}`,
                    inline: true
                },
                {
                    name: `#4 ${u[3] !== undefined ? u[3].userName + '#' + u[3].userDisc : 'Nobody'}`,
                    value: `￥${u[3] !== undefined ? u[3].currency : '0'}`,
                    inline: true
                },
                {
                    name: `#5 ${u[4] !== undefined ? u[4].userName + '#' + u[4].userDisc : 'Nobody'}`,
                    value: `￥${u[4] !== undefined ? u[4].currency : '0'}`,
                    inline: true
                },
                {
                    name: `#6 ${u[5] !== undefined ? u[5].userName + '#' + u[5].userDisc : 'Nobody'}`,
                    value: `￥${u[5] !== undefined ? u[5].currency : '0'}`,
                    inline: true
                },
                {
                    name: `#7 ${u[6] !== undefined ? u[6].userName + '#' + u[6].userDisc : 'Nobody'}`,
                    value: `￥${u[6] !== undefined ? u[6].currency : '0'}`,
                    inline: true
                },
                {
                    name: `#8 ${u[7] !== undefined ? u[7].userName + '#' + u[7].userDisc : 'Nobody'}`,
                    value: `￥${u[7] !== undefined ? u[7].currency : '0'}`,
                    inline: true
                },
                {
                    name: `#9 ${u[8] !== undefined ? u[8].userName + '#' + u[8].userDisc : 'Nobody'}`,
                    value: `￥${u[8] !== undefined ? u[8].currency : '0'}`,
                    inline: true
                },
                {
                    name: `#10 ${u[9] !== undefined ? u[9].userName + '#' + u[9].userDisc : 'Nobody'}`,
                    value: `￥${u[9] !== undefined ? u[9].currency : '0'}`,
                    inline: true
                }],
                timestamp: new Date()
            } }).catch(this.logger.error);
        }).catch(this.logger.error);
    }
}

module.exports = Leaderboard;

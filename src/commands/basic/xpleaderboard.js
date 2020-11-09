/* eslint prefer-template: 0 */

const { Command } = require('sylphy');

class XPLeaderboard extends Command {
    constructor (...args) {
        super(...args, {
            name: 'xpleaderboard',
            group: 'basic',
            aliases: ['xplb'],
            cooldown: 5,
            options: { guildOnly: true }
        });
    }

    handle ({ client, msg }, responder) {
        client.mongodb.models.users.find({ serverID: msg.channel.guild.id }, null, { sort: { xp: -1 } }, (error, u) => {
            if (error || !u) {
                return responder.send(`${msg.author.mention} couldn't find Guild or User (BOTS HAVE NO PROFILES)`, { embed: {
                    color: client.redColor,
                    title: 'XPLeaderboard.Find Error',
                    description: `${error}`,
                    timestamp: new Date()
                } }).catch(this.logger.error);
            }

            return responder.send(' ', { embed: {
                color: client.satomiColor,
                description: `Your ranking: #${u.findIndex(i => i.userID === msg.author.id) + 1}`,
                author: {
                    name: `${msg.channel.guild.name} XP Leaderboard`,
                    icon_url: msg.channel.guild.iconURL
                },
                fields: [{
                    name: `#1 ${u[0].userName} # ${u[0].userDisc}`,
                    value: `Level ${u[0].level} - ${u[0].xp} XP`,
                    inline: false
                },
                {
                    name: `#2 ${u[1] !== undefined ? u[1].userName + '#' + u[1].userDisc : 'Nobody'}`,
                    value: `${u[1] !== undefined ? 'Level ' + u[1].level + ' - ' + u[1].xp + ' XP' : 'Level 0 - 0 XP'}`,
                    inline: false

                },
                {
                    name: `#3 ${u[2] !== undefined ? u[2].userName + '#' + u[2].userDisc : 'Nobody'}`,
                    value: `${u[2] !== undefined ? 'Level ' + u[2].level + ' - ' + u[2].xp + ' XP' : 'Level 0 - 0 XP'}`,
                    inline: false
                },
                {
                    name: `#4 ${u[3] !== undefined ? u[3].userName + '#' + u[3].userDisc : 'Nobody'}`,
                    value: `${u[3] !== undefined ? 'Level ' + u[3].level + ' - ' + u[3].xp + ' XP' : 'Level 0 - 0 XP'}`,
                    inline: false
                },
                {
                    name: `#5 ${u[4] !== undefined ? u[4].userName + '#' + u[4].userDisc : 'Nobody'}`,
                    value: `${u[4] !== undefined ? 'Level ' + u[4].level + ' - ' + u[4].xp + ' XP' : 'Level 0 - 0 XP'}`,
                    inline: false
                },
                {
                    name: `#6 ${u[5] !== undefined ? u[5].userName + '#' + u[5].userDisc : 'Nobody'}`,
                    value: `${u[5] !== undefined ? 'Level ' + u[5].level + ' - ' + u[5].xp + ' XP' : 'Level 0 - 0 XP'}`,
                    inline: false
                },
                {
                    name: `#7 ${u[6] !== undefined ? u[6].userName + '#' + u[6].userDisc : 'Nobody'}`,
                    value: `${u[6] !== undefined ? 'Level ' + u[6].level + ' - ' + u[6].xp + ' XP' : 'Level 0 - 0 XP'}`,
                    inline: false
                },
                {
                    name: `#8 ${u[7] !== undefined ? u[7].userName + '#' + u[7].userDisc : 'Nobody'}`,
                    value: `${u[7] !== undefined ? 'Level ' + u[7].level + ' - ' + u[7].xp + ' XP' : 'Level 0 - 0 XP'}`,
                    inline: false
                },
                {
                    name: `#9 ${u[8] !== undefined ? u[8].userName + '#' + u[8].userDisc : 'Nobody'}`,
                    value: `${u[8] !== undefined ? 'Level ' + u[8].level + ' - ' + u[8].xp + ' XP' : 'Level 0 - 0 XP'}`,
                    inline: false
                },
                {
                    name: `#10 ${u[9] !== undefined ? u[9].userName + '#' + u[9].userDisc : 'Nobody'}`,
                    value: `${u[9] !== undefined ? 'Level ' + u[9].level + ' - ' + u[9].xp + ' XP' : 'Level 0 - 0 XP'}`,
                    inline: false
                }],
                timestamp: new Date()
            } }).catch(this.logger.error);
        }).catch(this.logger.error);
    }
}

module.exports = XPLeaderboard;

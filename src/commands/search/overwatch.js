const { Command } = require('sylphy');
const axios = require('axios');

class Overwatch extends Command {
    constructor(...args) {
        super(...args, {
            name: 'overwatch',
            group: 'search',
            aliases: ['ow'],
            cooldown: 5,
            options: { guildOnly: true },
            usage: [
                { name: 'type', displayName: 'type', type: 'string', optional: false },
                { name: 'platform', displayName: 'platform', type: 'string', optional: false },
                { name: 'region', displayName: 'region', type: 'string', optional: false },
                { name: 'battletag', displayName: 'battletag', type: 'string', optional: false, last: true }
            ]
        });
    }

    async handle ({ args, client, msg }, responder) {
        const regionCheck = () => {
            if (args.region === 'na') {
                args.region.replace('na', 'us');
            } else if (args.region === 'kr') {
                args.region.replace('kr', 'asia');
            } else if (args.region === 'cn') {
                args.region.replace('cn', 'asia');
            }
        };

        const type = args.type; // profile, competitive, quickplay
        const platform = args.platform; // pc, xbl, psn
        const region = regionCheck(args.region); // us, eu, asia, global
        const battletag = args.battletag.replace('#', '-'); // case sensitive

        if (type === 'profile' || type === 'p') {
            client.sendChannelTyping(msg.channel.id);

            const profile = await axios.get(`http://overwatchy.com/profile/${platform}/${region}/${battletag}`, {
                headers: {
                    'User-Agent': client.userAgent
                }
            }).catch((err) => {
                if (err) {
                    return responder.send(' ', { embed: {
                        color: client.redColor,
                        title: 'Error',
                        description: `${err}`,
                        timestamp: new Date()
                    } }).catch(this.logger.error);
                }
            });

            return responder.send(' ', { embed: {
                color: 0xe59d2d,
                title: `Overwatch Profile Info for: ${profile.data.username}`,
                description: `Private? ${profile.data.private}`,
                thumbnail: {
                    url: `${profile.data.portrait}`
                },
                fields: [{
                    name: 'General Stats',
                    value: `Level: ${profile.data.level}` +
                        `\nEndorsement: ${profile.data.endorsement.level}` +
                        `\nSkill Rating: ${profile.data.competitive.rank}`,
                    inline: true
                },
                {
                    name: 'Overall Quickplay',
                    value: `Playtime: ${profile.data.playtime.quickplay}` +
                        `\nWins: ${profile.data.games.quickplay.won}`,
                    inline: true
                },
                {
                    name: 'Overall Competitive',
                    value: `Playtime: ${profile.data.playtime.competitive}` +
                        `\nGames Won: ${profile.data.games.competitive.won}` +
                        `\nGames Lost: ${profile.data.games.competitive.lost}` +
                        `\nGame Draws: ${profile.data.games.competitive.draw}` +
                        `\nTotal Games: ${profile.data.games.competitive.played}`,
                    inline: true
                }],
                timestamp: new Date()
            } }).catch(this.logger.error);
        }

        if (type === 'competitive' || type === 'comp' || type === 'c') {
            client.sendChannelTyping(msg.channel.id);

            const stats = await axios.get(`http://overwatchy.com/stats/${platform}/${region}/${battletag}`, {
                headers: {
                    'User-Agent': client.userAgent
                }
            }).catch((err) => {
                if (err) {
                    return responder.send(' ', { embed: {
                        color: client.redColor,
                        title: 'Error',
                        description: `${err}`,
                        timestamp: new Date()
                    } }).catch(this.logger.error);
                }
            });

            return responder.send(' ', { embed: {
                color: 0xe59d2d,
                title: `Overwatch Competitive Info for: ${stats.data.username}`,
                description: `Private? ${stats.data.private}`,
                thumbnail: {
                    url: `${stats.data.portrait}`
                },
                fields: [{
                    name: 'General Competitive Stats',
                    value: `Games Played: ${stats.data.stats.game.competitive[1].value}` +
                        `\nGames Won: ${stats.data.stats.game.competitive[3].value}` +
                        `\nGames Lost: ${stats.data.stats.game.competitive[0].value}` +
                        `\nGames Tied: ${stats.data.stats.game.competitive[2].value}` +
                        `\nTime Played: ${stats.data.stats.game.competitive[4].value}` +
                        `\nTotal Medals: ${stats.data.stats.match_awards.competitive[1].value}` +
                        `\nGold Medals: ${stats.data.stats.match_awards.competitive[2].value}` +
                        `\nSilver Medals: ${stats.data.stats.match_awards.competitive[3].value}` +
                        `\nBronze Medals: ${stats.data.stats.match_awards.competitive[4].value}`,
                    inline: true
                },
                {
                    name: 'All Time Totals',
                    value: `All Damage: ${stats.data.stats.combat.competitive[0].value}` +
                        `\nDeaths: ${stats.data.stats.combat.competitive[3].value}` +
                        `\nEliminations: ${stats.data.stats.combat.competitive[4].value}` +
                        `\nFinal Blows: ${stats.data.stats.combat.competitive[6].value}` +
                        `\nObjective Kills: ${stats.data.stats.combat.competitive[10].value}` +
                        `\nObjective Time: ${stats.data.stats.combat.competitive[11].value}` +
                        `\nSolo Kills: ${stats.data.stats.combat.competitive[12].value}` +
                        `\nTime On Fire: ${stats.data.stats.combat.competitive[13].value}`,
                    inline: true
                },
                {
                    name: 'Average Per 10 Minutes',
                    value: `All Damage: ${stats.data.stats.average.competitive[0].value}` +
                    `\nDeaths: ${stats.data.stats.average.competitive[2].value}` +
                    `\nEliminations: ${stats.data.stats.average.competitive[3].value}` +
                    `\nFinal Blows: ${stats.data.stats.average.competitive[4].value}` +
                    `\nObjective Kills: ${stats.data.stats.average.competitive[7].value}` +
                    `\nObjective Time: ${stats.data.stats.average.competitive[8].value}` +
                    `\nSolo Kills: ${stats.data.stats.average.competitive[9].value}` +
                    `\nTime On Fire: ${stats.data.stats.average.competitive[10].value}`,
                    inline: true
                },
                {
                    name: 'Best In Game',
                    value: `All Damage: ${stats.data.stats.best.competitive[0].value}` +
                    '\nDeaths: --' +
                    `\nEliminations: ${stats.data.stats.best.competitive[3].value}` +
                    `\nFinal Blows: ${stats.data.stats.best.competitive[5].value}` +
                    `\nObjective Kills: ${stats.data.stats.best.competitive[11].value}` +
                    `\nObjective Time: ${stats.data.stats.best.competitive[12].value}` +
                    `\nSolo Kills: ${stats.data.stats.best.competitive[14].value}` +
                    `\nTime On Fire: ${stats.data.stats.best.competitive[16].value}`,
                    inline: true
                }],
                timestamp: new Date()
            } }).catch(this.logger.error);
        }

        if (type === 'quickplay' || type === 'quick' || type === 'q') {
            client.sendChannelTyping(msg.channel.id);

            const stats = await axios.get(`http://overwatchy.com/stats/${platform}/${region}/${battletag}`, {
                headers: {
                    'User-Agent': client.userAgent
                }
            }).catch((err) => {
                if (err) {
                    return responder.send(' ', { embed: {
                        color: client.redColor,
                        title: 'Error',
                        description: `${err}`,
                        timestamp: new Date()
                    } }).catch(this.logger.error);
                }
            });

            return responder.send(' ', { embed: {
                color: 0xe59d2d,
                title: `Overwatch Quickplay Info for: ${stats.data.username}`,
                description: `Private? ${stats.data.private}`,
                thumbnail: {
                    url: `${stats.data.portrait}`
                },
                fields: [{
                    name: 'General Quickplay Stats',
                    value: 'Games Played: --' +
                        `\nGames Won: ${stats.data.stats.game.quickplay[0].value}` +
                        '\nGames Lost: --' +
                        '\nGames Tied: --' +
                        `\nTime Played: ${stats.data.stats.game.quickplay[1].value}` +
                        `\nTotal Medals: ${stats.data.stats.match_awards.quickplay[1].value}` +
                        `\nGold Medals: ${stats.data.stats.match_awards.quickplay[2].value}` +
                        `\nSilver Medals: ${stats.data.stats.match_awards.quickplay[3].value}` +
                        `\nBronze Medals: ${stats.data.stats.match_awards.quickplay[4].value}`,
                    inline: true
                },
                {
                    name: 'All Time Totals',
                    value: `All Damage: ${stats.data.stats.combat.quickplay[0].value}` +
                        `\nDeaths: ${stats.data.stats.combat.quickplay[3].value}` +
                        `\nEliminations: ${stats.data.stats.combat.quickplay[4].value}` +
                        `\nFinal Blows: ${stats.data.stats.combat.quickplay[6].value}` +
                        `\nObjective Kills: ${stats.data.stats.combat.quickplay[10].value}` +
                        `\nObjective Time: ${stats.data.stats.combat.quickplay[11].value}` +
                        `\nSolo Kills: ${stats.data.stats.combat.quickplay[12].value}` +
                        `\nTime On Fire: ${stats.data.stats.combat.quickplay[13].value}`,
                    inline: true
                },
                {
                    name: 'Average Per 10 Minutes',
                    value: `All Damage: ${stats.data.stats.average.quickplay[0].value}` +
                    `\nDeaths: ${stats.data.stats.average.quickplay[2].value}` +
                    `\nEliminations: ${stats.data.stats.average.quickplay[3].value}` +
                    `\nFinal Blows: ${stats.data.stats.average.quickplay[4].value}` +
                    `\nObjective Kills: ${stats.data.stats.average.quickplay[7].value}` +
                    `\nObjective Time: ${stats.data.stats.average.quickplay[8].value}` +
                    `\nSolo Kills: ${stats.data.stats.average.quickplay[9].value}` +
                    `\nTime On Fire: ${stats.data.stats.average.quickplay[10].value}`,
                    inline: true
                },
                {
                    name: 'Best In Game',
                    value: `All Damage: ${stats.data.stats.best.quickplay[0].value}` +
                    '\nDeaths: --' +
                    `\nEliminations: ${stats.data.stats.best.quickplay[3].value}` +
                    `\nFinal Blows: ${stats.data.stats.best.quickplay[5].value}` +
                    `\nObjective Kills: ${stats.data.stats.best.quickplay[11].value}` +
                    `\nObjective Time: ${stats.data.stats.best.quickplay[12].value}` +
                    `\nSolo Kills: ${stats.data.stats.best.quickplay[14].value}` +
                    `\nTime On Fire: ${stats.data.stats.best.quickplay[16].value}`,
                    inline: true
                }],
                timestamp: new Date()
            } }).catch(this.logger.error);
        }
    }
}

module.exports = Overwatch;

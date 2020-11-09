const { Command } = require('sylphy');
const osu = require('node-osu');

class Osu extends Command {
    constructor(...args) {
        super (...args, {
            name: 'osu',
            group: 'search',
            cooldown: 5,
            options: { guildOnly: true },
            usage: [
                { name: 'searchType', displayName: 'searchType', type: 'string', choices: ['profile', 'best', 'recent'], optional: true, last: false },
                { name: 'player', displayName: 'player', type: 'string', optional: false, last: true }
            ]
        });
    }

    handle ({ args, client, msg }, responder) {
        const searchType = args.searchType;
        const player = args.player;

        function addCommas(x) {
            const parts = x.toString().split('.');
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            return parts.join('.');
        }

        if (!searchType || searchType === 'profile') {
            client.sendChannelTyping(msg.channel.id);

            const osuApi = new osu.Api(process.env.API_OSU, {
                baseUrl: 'https://osu.ppy.sh/api',
                notFoundAsError: true,
                completeScores: false
            });

            osuApi.getUser({ u: `${player}` }).then((user) => {
                return responder.send(' ', { embed: {
                    color: client.satomiColor,
                    title: `Osu Player Info - ${user.name}`,
                    thumbnail: {
                        url: `https://a.ppy.sh/${user.id}`
                    },
                    image: {
                        url: `http://lemmmy.pw/osusig/sig.php?colour=pink&uname=${player}&mode=0&pp=1&removeavmargin&flagshadow&flagstroke&darktriangles&onlineindicator=undefined&xpbar`
                    },
                    fields: [{
                        name: 'Basic',
                        value: `Country: ${user.country} :flag_${(user.country).toLowerCase()}:` +
                        `\nLevel: ${user.level}` +
                        `\nAccuracy: ${user.accuracyFormatted}` +
                        `\nTotal Score: ${addCommas(user.scores.total)}`,
                        inline: true
                    },
                    {
                        name: 'Counts',
                        value: `300: ${addCommas(user.counts['300'])}` +
                        `\n100: ${addCommas(user.counts['100'])}` +
                        `\n50: ${addCommas(user.counts['50'])}` +
                        `\nPlays: ${addCommas(user.counts.plays)}`,
                        inline: true
                    },
                    {
                        name: 'Performance',
                        value: `PP: ${addCommas(user.pp.raw)}` +
                        `\nSS: ${user.counts.SS}` +
                        `\nS: ${user.counts.S}` +
                        `\nA: ${user.counts.A}`,
                        inline: true
                    },
                    {
                        name: 'Ranks',
                        value: `Global Rank: #${addCommas(user.pp.rank)}` +
                        `\nCountry Rank: #${addCommas(user.pp.countryRank)}` +
                        `\nRanked Score: ${addCommas(user.scores.ranked)}`,
                        inline: true
                    }]
                } }).catch(this.logger.error);
            }).catch((err) => {
                return responder.send(' ', { embed: {
                    color: client.redColor,
                    title: 'Osu Error',
                    description: `${err}`
                } }).catch(this.logger.error);
            });
        }

        if (searchType === 'best') {
            client.sendChannelTyping(msg.channel.id);

            const osuApi = new osu.Api(process.env.API_OSU, {
                baseUrl: 'https://osu.ppy.sh/api',
                notFoundAsError: true,
                completeScores: true
            });

            osuApi.getUser({ u: `${player}` }).then((user) => {
                osuApi.getUserBest({ u: `${player}` }).then((scores) => {
                    osuApi.getBeatmaps({ b: `${scores[0][0].beatmapId}` }).then((beatmaps) => {
                        return responder.send(' ', { embed: {
                            color: client.satomiColor,
                            title: `Osu Player Best Score - ${user.name}`,
                            description: `Date of occurence: ${scores[0][0].date}`,
                            thumbnail: {
                                url: `https://a.ppy.sh/${user.id}`
                            },
                            image: {
                                url: `http://lemmmy.pw/osusig/sig.php?colour=pink&uname=${player}&mode=0&pp=1&removeavmargin&flagshadow&flagstroke&darktriangles&onlineindicator=undefined&xpbar`
                            },
                            author: {
                                name: 'click to download the beatmap',
                                url: `https://osu.ppy.sh/b/${scores[0][1].id}`,
                                icon_url: `https://b.ppy.sh/thumb/${beatmaps[0].beatmapSetId}.jpg`
                            },
                            fields: [{
                                name: 'Beatmap Info',
                                value: `Title: ${beatmaps[0].title}` +
                                `\nCreator: ${beatmaps[0].creator}` +
                                `\nApproval Status: ${beatmaps[0].approvalStatus}` +
                                `\nVersion: ${beatmaps[0].version}`,
                                inline: true
                            },
                            {
                                name: 'Beatmap Difficulty',
                                value: `Rating: ${beatmaps[0].difficulty.rating}` +
                                `\nOverall: ${beatmaps[0].difficulty.overall}` +
                                `\nApproach: ${beatmaps[0].difficulty.approach}` +
                                `\nDrain: ${beatmaps[0].difficulty.drain}`,
                                inline: true
                            },
                            {
                                name: 'Score',
                                value: `Score: ${addCommas(scores[0][0].score)}` +
                                `\nPP: ${addCommas(scores[0][0].pp)}` +
                                `\nRank: ${scores[0][0].rank}` +
                                `\nMax Combo: ${addCommas(scores[0][0].maxCombo)}` +
                                `\nMisses: ${scores[0][0].counts.miss}`,
                                inline: true
                            },
                            {
                                name: 'Hits',
                                value: `300: ${addCommas(scores[0][0].counts['300'])}` +
                                `\n100: ${addCommas(scores[0][0].counts['100'])}` +
                                `\n50: ${addCommas(scores[0][0].counts['50'])}` +
                                `\nGeki: ${scores[0][0].counts.geki}` +
                                `\nKatu: ${scores[0][0].counts.katu}`,
                                inline: true
                            }],
                            timestamp: new Date()
                        } }).catch(this.logger.error);
                    }).catch((err) => {
                        return responder.send(' ', { embed: {
                            color: client.redColor,
                            title: 'Osu Error',
                            description: `${err}`
                        } }).catch(this.logger.error);
                    });
                }).catch((err) => {
                    return responder.send(' ', { embed: {
                        color: client.redColor,
                        title: 'Osu Error',
                        description: `${err}`
                    } }).catch(this.logger.error);
                });
            }).catch((err) => {
                return responder.send(' ', { embed: {
                    color: client.redColor,
                    title: 'Osu Error',
                    description: `${err}`
                } }).catch(this.logger.error);
            });
        }

        if (searchType === 'recent') {
            client.sendChannelTyping(msg.channel.id);

            const osuApi = new osu.Api(process.env.API_OSU, {
                baseUrl: 'https://osu.ppy.sh/api',
                notFoundAsError: true,
                completeScores: true
            });

            osuApi.getUser({ u: `${player}` }).then((user) => {
                osuApi.getUserBest({ u: `${player}` }).then((scores) => {
                    osuApi.getBeatmaps({ b: `${scores[0][0].beatmapId}` }).then((beatmaps) => {
                        return responder.send(' ', { embed: {
                            color: client.satomiColor,
                            title: `Osu Player Recent Score - ${user.name}`,
                            description: `Date of occurence: ${scores[0][0].date}`,
                            thumbnail: {
                                url: `https://a.ppy.sh/${user.id}`
                            },
                            image: {
                                url: `http://lemmmy.pw/osusig/sig.php?colour=pink&uname=${player}&mode=0&pp=1&removeavmargin&flagshadow&flagstroke&darktriangles&onlineindicator=undefined&xpbar`
                            },
                            author: {
                                name: 'click to download the beatmap',
                                url: `https://osu.ppy.sh/b/${scores[0][1].id}`,
                                icon_url: `https://b.ppy.sh/thumb/${beatmaps[0].beatmapSetId}.jpg`
                            },
                            fields: [{
                                name: 'Beatmap Info',
                                value: `Title: ${beatmaps[0].title}` +
                                `\nCreator: ${beatmaps[0].creator}` +
                                `\nApproval Status: ${beatmaps[0].approvalStatus}` +
                                `\nVersion: ${beatmaps[0].version}`,
                                inline: true
                            },
                            {
                                name: 'Beatmap Difficulty',
                                value: `Rating: ${beatmaps[0].difficulty.rating}` +
                                `\nOverall: ${beatmaps[0].difficulty.overall}` +
                                `\nApproach: ${beatmaps[0].difficulty.approach}` +
                                `\nDrain: ${beatmaps[0].difficulty.drain}`,
                                inline: true
                            },
                            {
                                name: 'Score',
                                value: `Score: ${addCommas(scores[0][0].score)}` +
                                `\nPP: ${addCommas(scores[0][0].pp)}` +
                                `\nRank: ${scores[0][0].rank}` +
                                `\nMax Combo: ${addCommas(scores[0][0].maxCombo)}` +
                                `\nMisses: ${scores[0][0].counts.miss}`,
                                inline: true
                            },
                            {
                                name: 'Hits',
                                value: `300: ${addCommas(scores[0][0].counts['300'])}` +
                                `\n100: ${addCommas(scores[0][0].counts['100'])}` +
                                `\n50: ${addCommas(scores[0][0].counts['50'])}` +
                                `\nGeki: ${scores[0][0].counts.geki}` +
                                `\nKatu: ${scores[0][0].counts.katu}`,
                                inline: true
                            }],
                            timestamp: new Date()
                        } }).catch(this.logger.error);
                    }).catch((err) => {
                        return responder.send(' ', { embed: {
                            color: client.redColor,
                            title: 'Osu Error',
                            description: `${err}`
                        } }).catch(this.logger.error);
                    });
                }).catch((err) => {
                    return responder.send(' ', { embed: {
                        color: client.redColor,
                        title: 'Osu Error',
                        description: `${err}`
                    } }).catch(this.logger.error);
                });
            }).catch((err) => {
                return responder.send(' ', { embed: {
                    color: client.redColor,
                    title: 'Osu Error',
                    description: `${err}`
                } }).catch(this.logger.error);
            });
        }
    }
}

module.exports = Osu;

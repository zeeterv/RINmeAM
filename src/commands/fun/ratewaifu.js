const { Command } = require('sylphy');

class RateWaifu extends Command {
    constructor (...args) {
        super(...args, {
            name: 'ratewaifu',
            group: 'fun',
            cooldown: 2,
            options: { guildOnly: true },
            usage: [
                { name: 'waifu', displayName: 'waifu', type: 'member', optional: true, last: true }
            ]
        });
    }

    handle ({ client, msg }, responder) {
        const waifu = msg.channel.guild.members.get(msg.mentions[0].id);
        const hotness = (Math.random() * 10).toPrecision(3);
        const craziness = (Math.random() * 10).toPrecision(3);

        let hotReact = '';
        if (hotness === 10.00) {
            hotReact = 'an angel :heart_eyes:';
        } else if (hotness >= 8.00 || hotness >= 9.00) {
            hotReact = 'what a keeper :blush:';
        } else if (hotness >= 5.00 || hotness >= 6.00 || hotness >= 7.00) {
            hotReact = 'average, dont be discouraged though';
        } else if (hotness >= 2.00 || hotness >= 3.00 || hotness >= 4.00) {
            hotReact = 'doable, might want to find a better one';
        } else if (hotness >= 0.000 || hotness >= 1.00) {
            hotReact = 'idk, go next waifu :mask:';
        }

        let crazyReact = '';
        if (craziness === 10.00) {
            crazyReact = 'that waifu is a yandere, go next waifu :fearful:';
        } else if (craziness >= 8.00 || craziness >= 9.00) {
            crazyReact = 'theyre leaning too much into crazy, but okay';
        } else if (craziness >= 5.00 || craziness >= 6.00 || craziness >= 7.00) {
            crazyReact = 'above average craziness, youre mostly okay :thumbsup:';
        } else if (craziness >= 2.00 || craziness >= 3.00 || craziness >= 4.00) {
            crazyReact = 'average craziness, 98% in the clear';
        } else if (craziness >= 0.000 && craziness >= 1.00) {
            crazyReact = 'either a complete angel or robot :thinking:';
        }

        if (msg.mentions.length === 0) {
            return responder.send(`${msg.author.mention}, Please mention a user to rate~! owo`);
        }

        return responder.send(`${msg.author.mention}, I rate your waifu...`, { embed: {
            color: client.satomiColor,
            title: `Waifu - ${waifu.username}#${waifu.discriminator}`,
            description: 'owo uwu',
            thumbnail: {
                url: waifu.avatarURL
            },
            fields: [{
                name: 'Hot/Cute',
                value: `${hotness}`,
                inline: true
            },
            {
                name: 'Crazy',
                value: `${craziness}`,
                inline: true
            },
            {
                name: 'Satomi says...',
                value: `${hotness}/10 hot? ${hotReact}\n${craziness}/10 crazy? ${crazyReact}`,
                inline: false
            }],
            timestamp: new Date()
        } }).catch(this.logger.error);
    }
}

module.exports = RateWaifu;

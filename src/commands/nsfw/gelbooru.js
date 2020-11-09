const { Command } = require('sylphy');
const axios = require('axios');

class Gelbooru extends Command {
    constructor(...args) {
        super(...args, {
            name: 'gelbooru',
            group: 'nsfw',
            cooldown: 2,
            options: { guildOnly: true },
            usage: [
                { name: 'tags', displayName: 'tags', type: 'string', optional: true, last: true }
            ]
        });
    }

    async handle ({ args, client, msg }, responder) {
        const tags = args.tags;
        const randomInt = Math.floor(Math.random() * 100);
        const blacklist = ['loli', 'shota', 'cub', 'young', 'child', 'baby', 'guro', 'gore', 'vore', 'scat'];

        if (tags.length !== 0) {
            if (blacklist.includes(tags.toLowerCase())) {
                return responder.send('⛔ | Blacklisted word found');
            }
        }

        if (msg.channel.nsfw === false) {
            return responder.send('🔞 | This channel is SFW, ask a mod or admin to do `s.setnsfw on` or make the channel NSFW from the channel settings');
        }

        client.sendChannelTyping(msg.channel.id);

        const res = await axios.get(`https://gelbooru.com/index.php?page=dapi&s=post&q=index&limit=100&tags=${tags}+-rating:safe&json=1`, {
            headers: {
                'User-Agent': client.userAgent
            }
        }).catch(this.logger.error);

        if (blacklist.includes(res.data[randomInt].tags.toLowerCase())) {
            return responder.send('⛔ | Sorry! This image had a tag that was on the blacklist, try again');
        }

        const getRating = (rating) => {
            if (rating === 's') {
                return 'Safe';
            }
            if (rating === 'q') {
                return 'Questionable';
            }
            if (rating === 'e') {
                return 'Explicit';
            }
            if (rating === 'u') {
                return 'Unrated';
            }
        };

        return responder.send(' ', { embed: {
            color: client.nsfwColor,
            title: `Gelbooru - ${!tags ? 'Random Image' : tags}`,
            description: `[Source](https://gelbooru.com/index.php?page=post&s=view&id=${res.data[randomInt].id})`,
            image: {
                url: res.data[randomInt].file_url
            },
            timestamp: new Date(),
            footer: {
                icon_url: msg.author.dynamicAvatarURL(),
                text: `Score: ${res.data[randomInt].score} | Rating: ${getRating(res.data[randomInt].rating)}`
            }
        } }).catch(this.logger.error);
    }
}

module.exports = Gelbooru;

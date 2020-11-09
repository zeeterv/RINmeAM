const { Command } = require('sylphy');
const axios = require('axios');

class Danbooru extends Command {
    constructor(...args) {
        super(...args, {
            name: 'danbooru',
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
        const randomInt = Math.floor(Math.random() * 200);
        const blacklist = ['loli', 'shota', 'cub', 'young', 'child', 'baby', 'guro', 'gore', 'vore', 'scat'];

        if (tags.length !== 0) {
            if (blacklist.includes(tags.toLowerCase())) {
                return responder.send('⛔ | Blacklisted word found');
            }
        }

        if (tags.split(' ').length > 2) {
            return responder.send('⛔ | Danbooru only allows 2 tags');
        }

        if (msg.channel.nsfw === false) {
            return responder.send('🔞 | This channel is SFW, ask a mod or admin to do `s.setnsfw on` or make the channel NSFW from the channel settings');
        }

        client.sendChannelTyping(msg.channel.id);

        const res = await axios.get(`https://danbooru.donmai.us/posts.json?limit=200&tags=${tags}+-rating:safe`, {
            headers: {
                'User-Agent': client.userAgent
            }
        }).catch(this.logger.error);

        if (blacklist.includes(res.data[randomInt].tag_string.toLowerCase())) {
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
            title: `Danbooru - ${!tags ? 'Random Image' : tags}`,
            description: `[Source](http://danbooru.donmai.us/posts/${res.data[randomInt].id})`,
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

module.exports = Danbooru;

const { Command } = require('sylphy');
const axios = require('axios');

class Catgirl extends Command {
    constructor(...args) {
        super(...args, {
            name: 'catgirl',
            group: 'search',
            aliases: ['neko'],
            cooldown: 5,
            options: { guildOnly: true },
            usage: [
                { name: 'options', displayName: 'options', type: 'string', optional: true, last: true }
            ]
        });
    }

    async handle ({ args, client, msg }, responder) {
        const options = args.options;

        const sites = ['nekos.moe', 'nekos.life'];
        const site = sites[Math.floor(Math.random() * sites.length)];

        if (options === 'sfw' || !options) {
            if (site === 'nekos.moe') {
                client.sendChannelTyping(msg.channel.id);

                const res = await axios.get('https://nekos.moe/api/v1/random/image?count=1&nsfw=false', {
                    headers: {
                        'User-Agent': client.userAgent
                    }
                }).catch(this.logger.error);

                return responder.send(' ', { embed: {
                    color: client.satomiColor,
                    description: `[Source](https://nekos.moe/image/${res.data.images[0].id})`,
                    image: {
                        url: `https://nekos.moe/image/${res.data.images[0].id}`
                    },
                    timestamp: new Date()
                } }).catch(this.logger.error);
            } else if (site === 'nekos.life') {
                client.sendChannelTyping(msg.channel.id);

                const res = await axios.get('https://nekos.life/api/v2/img/neko', {
                    headers: {
                        'User-Agent': client.userAgent
                    }
                }).catch(this.logger.error);

                return responder.send(' ', { embed: {
                    color: client.satomiColor,
                    description: `[Source](${res.data.url})`,
                    image: {
                        url: res.data.url
                    },
                    timestamp: new Date()
                } }).catch(this.logger.error);
            }
        }

        if (options === 'nsfw') {
            if (msg.channel.nsfw === false) {
                return responder.send('Please ask an admin to enable nsfw in this channel (s.setnsfw on)').catch(this.logger.error);
            }

            if (site === 'nekos.moe') {
                client.sendChannelTyping(msg.channel.id);

                const res = await axios.get('https://nekos.moe/api/v1/random/image?count=1&nsfw=true', {
                    headers: {
                        'User-Agent': client.userAgent
                    }
                }).catch(this.logger.error);

                return responder.send(' ', { embed: {
                    color: client.satomiColor,
                    description: `[Source](https://nekos.moe/image/${res.data.images[0].id})`,
                    image: {
                        url: `https://nekos.moe/image/${res.data.images[0].id}`
                    },
                    timestamp: new Date()
                } }).catch(this.logger.error);
            } else if (site === 'nekos.life') {
                client.sendChannelTyping(msg.channel.id);

                const res = await axios.get('https://nekos.life/api/v2/img/lewd', {
                    headers: {
                        'User-Agent': client.userAgent
                    }
                }).catch(this.logger.error);

                return responder.send(' ', { embed: {
                    color: client.satomiColor,
                    description: `[Source](${res.data.url})`,
                    image: {
                        url: res.data.url
                    },
                    timestamp: new Date()
                } }).catch(this.logger.error);
            }
        }
    }
}

module.exports = Catgirl;


const { Command } = require('sylphy');
const snoowrap = require('snoowrap');

class Reddit extends Command {
    constructor(...args) {
        super (...args, {
            name: 'reddit',
            group: 'search',
            cooldown: 5,
            options: { guildOnly: true },
            usage: [
                { name: 'searchType', displayName: 'searchType', type: 'string', optional: true, last: true }
            ]
        });
    }

    handle ({ args, client, msg }, responder) {
        const searchType = args.searchType;

        const reddit = new snoowrap({
            userAgent: client.userAgent,
            clientId: process.env.API_REDDIT_ID,
            clientSecret: process.env.API_REDDIT_SECRET,
            refreshToken: process.env.API_REDDIT_REFRESH
        });

        if (searchType.length === 0 || searchType === 'frontpage') {
            client.sendChannelTyping(msg.channel.id);
            reddit.getHot().then((data) => {
                return responder.send('', { embed: {
                    color: client.redditColor,
                    author: {
                        name: 'Reddit Frontpage',
                        icon_url: 'https://www.redditstatic.com/desktop2x/img/favicon/apple-icon-180x180.png'
                    },
                    description: '',
                    fields: [{
                        name: data[0].title,
                        value: `https://reddit.com${data[0].permalink}`
                    },
                    {
                        name: data[1].title,
                        value: `https://reddit.com${data[1].permalink}`
                    },
                    {
                        name: data[2].title,
                        value: `https://reddit.com${data[2].permalink}`
                    },
                    {
                        name: data[3].title,
                        value: `https://reddit.com${data[3].permalink}`
                    },
                    {
                        name: data[4].title,
                        value: `https://reddit.com${data[4].permalink}`
                    }],
                    timestamp: new Date()
                } }).catch(this.logger.error);
            }).catch(this.logger.error);
        }

        if (searchType.length > 0 && searchType !== 'frontpage') {
            client.sendChannelTyping(msg.channel.id);
            reddit.getHot(searchType).then((data) => {
                return responder.send('', { embed: {
                    color: client.redditColor,
                    author: {
                        name: `/r/${searchType}`,
                        url: `https://www.reddit.com/r/${searchType}`,
                        icon_url: 'https://www.redditstatic.com/desktop2x/img/favicon/apple-icon-180x180.png'
                    },
                    description: '',
                    fields: [{
                        name: data[0].title,
                        value: `https://reddit.com${data[0].permalink}`
                    },
                    {
                        name: data[1].title,
                        value: `https://reddit.com${data[1].permalink}`
                    },
                    {
                        name: data[2].title,
                        value: `https://reddit.com${data[2].permalink}`
                    },
                    {
                        name: data[3].title,
                        value: `https://reddit.com${data[3].permalink}`
                    },
                    {
                        name: data[4].title,
                        value: `https://reddit.com${data[4].permalink}`
                    }],
                    timestamp: new Date()
                } }).catch(this.logger.error);
            }).catch(this.logger.error);
        }
    }
}

module.exports = Reddit;

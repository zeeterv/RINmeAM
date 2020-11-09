const { Command } = require('sylphy');
const moment = require('moment');

class ServerInfo extends Command {
    constructor (...args) {
        super (...args, {
            name: 'serverinfo',
            group: 'basic',
            aliases: ['server'],
            cooldown: 5,
            options: { guildOnly: true }
        });
    }

    handle ({ client, msg }, responder) {
        const server = msg.channel.guild;

        return responder.send(' ', {
            embed: {
                title: `${server.name} (${server.id})`,
                description: `Owner: <@!${server.ownerID}>`,
                author: {
                    name: 'Server Information:',
                    icon_url: server.iconURL
                },
                color: client.satomiColor,
                thumbnail: {
                    url: server.iconURL
                },
                image: {
                    url: server.bannerURL
                },
                fields: [{
                    name: 'Members Info',
                    value: `Members: ${server.memberCount}` +
                    `\nRoles: ${(server.roles.map(r => r.name)).length}` +
                    `\nBans: ${(server.getBans).length}`,
                    inline: true
                },
                {
                    name: `Channels [${(server.channels.map(c => c.name).length)}]`,
                    value: `Categories: ${Object.keys(server.channels.filter(c => c.type === 4)).length}` +
                    `\nText: ${Object.keys(server.channels.filter(c => c.type === 0)).length}` +
                    `\nVoice:  ${Object.keys(server.channels.filter(c => c.type === 2)).length}`,
                    inline: true
                },
                {
                    name: 'Other Info',
                    value: `Shard Number: ${server.shard.id}` +
                    `\nRegion: ${server.region}` +
                    `\nEmojis: ${(server.emojis).length}`,
                    inline: true
                },
                {
                    name: 'Server Created On:',
                    value: `${moment(server.createdAt).format('MMMM Do YYYY, h:mm a')}`,
                    inline: true
                }],
                timestamp: new Date(),
                footer: {
                    icon_url: client.user.avatarURL,
                    text: client.user.username
                }
            }
        }).catch(this.logger.error);
    }
}

module.exports = ServerInfo;

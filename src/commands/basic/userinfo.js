const { Command } = require('sylphy');
const moment = require('moment');

class UserInfo extends Command {
    constructor (...args) {
        super (...args, {
            name: 'userinfo',
            group: 'basic',
            aliases: ['user'],
            cooldown: 5,
            options: { guildOnly: true },
            usage: [
                { name: 'member', displayName: 'member', type: 'string', optional: true, last: true }
            ]
        });
    }

    handle ({ args, client, msg }, responder) {
        const member = args.member;

        let user;
        if (msg.mentions.length > 0) {
            user = msg.channel.guild.members.get(msg.mentions[0].id);
        } else if (member.length >= 17) {
            user = msg.channel.guild.members.get(member);
        } else {
            user = msg.channel.guild.members.get(msg.member.id);
        }

        return responder.send(' ', { embed: {
            title: 'User Information',
            description: `${user.username}#${user.discriminator}`,
            color: client.satomiColor,
            thumbnail: {
                url: user.user.dynamicAvatarURL()
            },
            fields: [{
                name: 'Nickname',
                value: `${user.nick !== null ? user.nick : 'None'}`,
                inline: true
            },
            {
                name: 'ID',
                value: `${user.id}`,
                inline: true
            },
            {
                name: 'Status',
                value: `${user.status}`,
                inline: true
            },
            {
                name: 'Game Playing',
                value: `${user.game !== null ? user.game.name : 'None'}`,
                inline: true
            },
            {
                name: 'Joined Server At',
                value: `${moment(user.joinedAt).format('MMMM Do YYYY')} at ${moment(user.joinedAt).format('h:mm a')}`,
                inline: true
            },
            {
                name: 'Created Discord Account',
                value: `${moment(user.createdAt).format('MMMM Do YYYY')} at ${moment(user.createdAt).format('h:mm a')}`,
                inline: true
            },
            {
                name: `Roles [${user.roles.length}]`,
                value: `${user.roles.map(roleid => msg.channel.guild.roles.get(roleid).name).join(', ') || 'None'}`,
                inline: false
            }],
            timestamp: new Date()
        } }).catch(this.logger.error);
    }
}

module.exports = UserInfo;

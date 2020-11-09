const { Command } = require('sylphy');

class Avatar extends Command {
    constructor (...args) {
        super (...args, {
            name: 'avatar',
            group: 'basic',
            cooldown: 5,
            options: { guildOnly: true },
            usage: [
                { name: 'options', displayName: 'options', type: 'string', optional: true, last: true }
            ]
        });
    }

    handle ({ args, msg }, responder) {
        const options = args.options;
        const user = msg.mentions[0] || msg.author;
        const server = msg.channel.guild;
        const avatarURL = user.dynamicAvatarURL('png', 256);

        if (!options) {
            return responder.send(`:camera: ${msg.author.mention} **${user.username}**'s Avatar:\n ${avatarURL}`).catch(this.logger.error);
        }

        if (options === 'server') {
            return responder.send(`:camera: ${msg.author.mention} **${server.name}**'s Avatar:\n ${server.iconURL}`).catch(this.logger.error);
        }
    }
}

module.exports = Avatar;

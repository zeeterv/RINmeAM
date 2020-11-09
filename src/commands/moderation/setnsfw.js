const { Command } = require('sylphy');

class SetNSFW extends Command {
    constructor(...args) {
        super(...args, {
            name: 'setnsfw',
            group: 'moderation',
            cooldown: 10,
            options: { guildOnly: true, requirements: { permissions: { manageChannels: true } } },
            usage: [
                { name: 'options', displayName: 'options', type: 'string', optional: true, last: true }
            ]
        });
    }

    handle ({ args, client, msg }, responder) {
        const options = args.options;

        if (options === 'on' && msg.channel.nsfw === true) {
            return responder.send(`${msg.author.mention} this channel already has the nsfw option enabled~`).catch(this.logger.error);
        }

        if (options === 'on' && msg.channel.nsfw === false) {
            client.editChannel(msg.channel.id, {
                nsfw: true
            }, 'enabling nsfw for lewdies~').then(() => {
                return responder.send(`${msg.author.mention} this channel now has the nsfw option enabled~ enjoy`).catch(this.logger.error);
            }).catch(this.logger.error);
        }

        if (options === 'off' && msg.channel.nsfw === true) {
            client.editChannel(msg.channel.id, {
                nsfw: false
            }, 'no more lewdies for this channel').then(() => {
                return responder.send(`${msg.author.mention} this channel isnt nsfw anymore`).catch(this.logger.error);
            }).catch(this.logger.error);
        }

        if (options === 'off' && msg.channel.nsfw === false) {
            return responder.send(`${msg.author.mention} this channel has nsfw disabled already`).catch(this.logger.error);
        }
    }
}

module.exports = SetNSFW;

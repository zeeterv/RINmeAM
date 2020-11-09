const { Command } = require('sylphy');

class Star extends Command {
    constructor (...args) {
        super(...args, {
            name: 'star',
            group: 'basic',
            cooldown: 10,
            options: { guildOnly: true },
            usage: [
                { name: 'options', displayName: 'options', type: 'string', choices: ['add', 'show'], optional: true, last: false },
                { name: 'msgid', displayName: 'msgid', type: 'string', optional: true, last: true }
            ]
        });
    }

    async handle ({ args, client, msg }, responder) {
        const options = args.options;
        const msgid = args.msgid;

        const imageType = (attachment) => {
            const imageLink = attachment.split('.');
            const typeOfImage = imageLink[imageLink.length - 1];
            const image = /(jpg|jpeg|png|gif)/gi.test(typeOfImage);
            if (!image) {
                return;
            }
            return attachment;
        };

        if (options === 'add') {
            await msg.channel.getMessage(msgid).then((message) => {
                if (message.author.id === msg.author.id) {
                    return responder.send(`${msg.author.mention} You cannot star your own message 💢`);
                }
                const imageURL = message.attachments[0] !== undefined ? imageType(message.attachments[0].url) : '';

                client.mongodb.models.guilds.findOne({ serverID: msg.channel.guild.id }, (error, g) => {
                    if (error) {
                        return responder.send(`${msg.author.mention} couldnt find the starboard channel`, { embed: {
                            color: client.redColor,
                            title: 'Star.star Error',
                            description: `${error}`,
                            timestamp: new Date()
                        } }).catch(this.logger.error);
                    }

                    this.send(g.starChannel, `⭐ <#${message.channel.id}> (${message.id})`, { embed: {
                        color: client.satomiColor,
                        author: {
                            name: message.author.username,
                            icon_url: message.author.dynamicAvatarURL()
                        },
                        description: message.cleanContent,
                        image: {
                            url: imageURL
                        },
                        timestamp: new Date()
                    } }).catch(this.logger.error);
                    return responder.send(`${msg.author.mention} message (${msgid}) has been starred! ⭐`);
                });
            });
        }

        if (options === 'show') {
            await msg.channel.getMessage(msgid).then((message) => {
                const imageURL = message.attachments[0] !== undefined ? imageType(message.attachments[0].url) : '';

                return responder.send(`⭐ <#${message.channel.id}> (${message.id})`, { embed: {
                    color: client.satomiColor,
                    author: {
                        name: message.author.username,
                        icon_url: message.author.dynamicAvatarURL()
                    },
                    description: message.cleanContent,
                    image: {
                        url: imageURL
                    },
                    timestamp: new Date()
                } }).catch(this.logger.error);
            });
        }
    }
}

module.exports = Star;

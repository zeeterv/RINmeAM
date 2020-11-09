const { Module } = require('sylphy');

class StarManager extends Module {
    constructor(...args) {
        super(...args, {
            name: 'star:manager',
            events: {
                messageReactionAdd: 'onReactionAdd'
            }
        });
    }

    init() {
        this.db = this._client.mongodb;
    }

    onReactionAdd(message, emoji, userID) {
        const imageType = (attachment) => {
            const imageLink = attachment.split('.');
            const typeOfImage = imageLink[imageLink.length - 1];
            const image = /(jpg|jpeg|png|gif)/gi.test(typeOfImage);
            if (!image) {
                return;
            }
            return attachment;
        };

        // if (message.author.bot === true) {
        //     return;
        // }

        if (message.author.id === userID) {
            this.send(`${message.channel.id}`, `${message.author.mention} You cannot star your own message 💢`);
        }

        if (message.channel.type === 1) {
            return;
        }

        if (message.content.startsWith('s.')) {
            return;
        }

        if (emoji.name !== '⭐') {
            return;
        }

        this.db.models.guilds.findOne({ serverID: message.channel.guild.id }, (error, g) => {
            if (error) {
                this.logger.error('Error finding user in DB', error);
            }

            if (!g || !g.starChannel) {
                return;
            }

            const imageURL = message.attachments[0] !== undefined ? imageType(message.attachments[0].url) : '';

            this.send(`${g.starChannel}`, `⭐ <#${message.channel.id}> (${message.id})`, { embed: {
                color: this._client.satomiColor,
                author: {
                    name: message.author.username,
                    icon_url: message.author.dynamicAvatarURL()
                },
                description: message.cleanContent,
                image: {
                    url: imageURL
                },
                timestamp: new Date()
            } }).then(() => {
                this.send(`${message.channel.id}`, `${message.author.mention} message (${message.id}) has been starred! ⭐`);
            });
        }).catch(this.logger.error);
    }
}

module.exports = StarManager;
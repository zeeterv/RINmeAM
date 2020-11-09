const { Command } = require('sylphy');
const axios = require('axios');

class Hug extends Command {
    constructor (...args) {
        super (...args, {
            name: 'hug',
            group: 'fun',
            cooldown: 5,
            options: { guildOnly: true },
            usage: [
                { name: 'user', displayName: 'user', type: 'member', optional: false }
            ]
        });
    }

    async handle ({ client, msg }, responder) {
        if (msg.mentions.length === 0) {
            return responder.send(`${msg.author.mention}, Please mention a user to hug~! owo`);
        }

        const user = msg.channel.guild.members.get(msg.mentions[0].id);

        if (user.id === client.user.id) {
            return responder.send(`Hey, ${msg.author.mention}! Don't hug me, baka!!! :anger:`);
        }

        if (user.id === msg.author.id) {
            return responder.send(`${msg.author.mention} Im sorry but, you can't hug yourself :confused:`);
        }

        const res = await axios.get('https://nekos.life/api/v2/img/hug', {
            headers: {
                'User-Agent': 'Satomi - (https://github.com/kyostra/satomi)'
            }
        }).catch(this.logger.error);

        return responder.send(`${msg.author.mention} hugged ${user.mention}! uwu`, { embed: {
            color: client.satomiColor,
            image: {
                url: res.data.url
            },
            timestamp: new Date()
        } }).catch(this.logger.error);
    }
}

module.exports = Hug;

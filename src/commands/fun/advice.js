const { Command } = require('sylphy');
const axios = require('axios');

class Advice extends Command {
    constructor(...args) {
        super(...args, {
            name: 'advice',
            group: 'fun',
            cooldown: 2,
            options: { guildOnly: true }
        });
    }

    async handle ({ client }, responder) {
        const res = await axios.get('http://api.adviceslip.com/advice');

        return responder.send(' ', { embed: {
            color: client.satomiColor,
            title: 'Advice Slip',
            description: res.data.slip.advice,
            timestamp: new Date(),
            footer: {
                icon_url: client.user.avatarURL,
                text: 'Source: http://adviceslip.com/'
            }
        } }).catch(this.logger.error);
    }
}

module.exports = Advice;

const { Command } = require('sylphy');

class SetBackground extends Command {
    constructor (...args) {
        super(...args, {
            name: 'setbackground',
            group: 'basic',
            aliases: ['setbg'],
            cooldown: 10,
            options: { guildOnly: true },
            usage: [
                { name: 'background', displayName: 'background', type: 'string', optional: true, last: true }
            ]
        });
    }

    handle ({ args, client, msg }, responder) {
        const member = msg.author.id;
        const background = args.background;
        const bgs = ['default', 'whitemarble', 'blackmarble'];

        if (bgs.includes(background) === false) {
            return responder.send('❗ The current backgrounds are `default`, `whitemarble`, `blackmarble`');
        }

        if (background === '-reset') {
            client.mongodb.models.users.findOneAndUpdate({ serverID: msg.channel.guild.id, userID: member }, { $set: { background: 'default' } }, { new: true }, (error, u) => {
                if (error || !u) {
                    return responder.send(`${msg.author.mention} couldn't find Guild or User`, { embed: {
                        color: client.redColor,
                        title: 'SetBackground.Find Error',
                        description: `${error}`,
                        timestamp: new Date()
                    } }).catch(this.logger.error);
                }

                return responder.send(' ', { embed: {
                    color: client.satomiColor,
                    title: 'SetBackground.Reset',
                    description: `Your background was set to the default **${u.background}**`,
                    timestamp: new Date()
                } }).catch(this.logger.error);
            }).catch(this.logger.error);
        }

        if (background !== '-reset') {
            client.mongodb.models.users.findOneAndUpdate({ serverID: msg.channel.guild.id, userID: member }, { $set: { background: background } }, { new: true }, (error, uu) => {
                if (error || !uu) {
                    return responder.send(`${msg.author.mention} couldn't find Guild or User`, { embed: {
                        color: client.redColor,
                        title: 'SetBackground.Find Error',
                        description: `${error}`,
                        timestamp: new Date()
                    } }).catch(this.logger.error);
                }

                return responder.send(' ', { embed: {
                    color: client.satomiColor,
                    title: 'SetBackground.Success',
                    description: `Your background was set to **${uu.background}**`,
                    timestamp: new Date()
                } }).catch(this.logger.error);
            }).catch(this.logger.error);
        }
    }
}

module.exports = SetBackground;

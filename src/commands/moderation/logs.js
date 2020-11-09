const { Command } = require('sylphy');

class Logs extends Command {
    constructor(...args) {
        super(...args, {
            name: 'logs',
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
        const channelID = msg.channel.id;

        if (options === 'on') {
            client.mongodb.models.guilds.findOneAndUpdate({ serverID: msg.channel.guild.id }, { $set: { logChannel: channelID } }, { new: true }, (error, g) => {
                if (error) {
                    return responder.send(`${msg.author.mention} couldnt update the log channel`, { embed: {
                        color: client.redColor,
                        title: 'Set.LogChannel Error',
                        description: `${error}`,
                        timestamp: new Date()
                    } }).catch(this.logger.error);
                }

                return responder.send(`${msg.author.mention} successfully updated the log channel`, { embed: {
                    color: client.blueColor,
                    title: 'Added LogChannel Info',
                    description: 'useful info below',
                    fields: [{
                        name: '---------',
                        value: `Channel: ${msg.channel.name}` +
                        `\nChannelID: ${g.logChannel}`
                    }],
                    timestamp: new Date()
                } }).catch(this.logger.error);
            }).catch(this.logger.error);
        }

        if (options === 'off') {
            client.mongodb.models.guilds.findOneAndUpdate({ serverID: msg.channel.guild.id }, { $set: { logChannel: '' } }, { new: true }, (error, g) => {
                if (error) {
                    return responder.send(`${msg.author.mention} couldnt update the log channel`, { embed: {
                        color: client.redColor,
                        title: 'Set.LogChannel Error',
                        description: `${error}`,
                        timestamp: new Date()
                    } }).catch(this.logger.error);
                }

                return responder.send(`${msg.author.mention} successfully updated the log channel`, { embed: {
                    color: client.blueColor,
                    title: 'Removed LogChannel Info',
                    description: 'useful info below',
                    fields: [{
                        name: '---------',
                        value: 'Channel: none' +
                        `\nChannelID: ${g.logChannel || 'none'}`
                    }],
                    timestamp: new Date()
                } }).catch(this.logger.error);
            }).catch(this.logger.error);
        }
    }
}

module.exports = Logs;

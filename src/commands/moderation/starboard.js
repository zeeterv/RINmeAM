const { Command } = require('sylphy');

class Starboard extends Command {
    constructor(...args) {
        super(...args, {
            name: 'starboard',
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
            client.mongodb.models.guilds.findOneAndUpdate({ serverID: msg.channel.guild.id }, { $set: { starChannel: channelID } }, { new: true }, (error, g) => {
                if (error) {
                    return responder.send(`${msg.author.mention} couldnt update the starboard channel`, { embed: {
                        color: client.redColor,
                        title: 'Set.StarChannel Error',
                        description: `${error}`,
                        timestamp: new Date()
                    } }).catch(this.logger.error);
                }

                return responder.send(`${msg.author.mention} successfully updated the starboard channel`, { embed: {
                    color: client.blueColor,
                    title: 'Added StarChannel Info',
                    description: 'useful info below',
                    fields: [{
                        name: '---------',
                        value: `Channel: ${msg.channel.name}` +
                        `\nChannelID: ${g.starChannel}`
                    }],
                    timestamp: new Date()
                } }).catch(this.logger.error);
            }).catch(this.logger.error);
        }

        if (options === 'off') {
            client.mongodb.models.guilds.findOneAndUpdate({ serverID: msg.channel.guild.id }, { $set: { starChannel: '' } }, { new: true }, (error, g) => {
                if (error) {
                    return responder.send(`${msg.author.mention} couldnt update the starboard channel`, { embed: {
                        color: client.redColor,
                        title: 'Set.StarChannel Error',
                        description: `${error}`,
                        timestamp: new Date()
                    } }).catch(this.logger.error);
                }

                return responder.send(`${msg.author.mention} successfully updated the starboard channel`, { embed: {
                    color: client.blueColor,
                    title: 'Removed StarChannel Info',
                    description: 'useful info below',
                    fields: [{
                        name: '---------',
                        value: 'Channel: none' +
                        `\nChannelID: ${g.starChannel || 'none'}`
                    }],
                    timestamp: new Date()
                } }).catch(this.logger.error);
            }).catch(this.logger.error);
        }
    }
}

module.exports = Starboard;

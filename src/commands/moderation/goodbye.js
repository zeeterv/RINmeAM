const { Command } = require('sylphy');

class Goodbye extends Command {
    constructor(...args) {
        super(...args, {
            name: 'goodbye',
            group: 'moderation',
            cooldown: 10,
            options: { guildOnly: true, requirements: { permissions: { manageChannels: true } } }
        });
    }

    async handle ({ client, msg }, responder) {
        const fullPrompt = [
            'Satomi.Goodbye Prompt',
            '```pl',
            '\n`This is the Satomi Goodbye Prompt, please respond with choice you want to do~`',
            '\n',
            '\n1. `set (to set a new goodbye message for the server)`',
            '\n2. `reset (deletes all goodbye settings for the server)`',
            '\n3. `show (shows the channel and message for goodbyes)`',
            '\n4. `cancel (cancels the goodbye prompt)`',
            '\n',
            '\nExample Response: set',
            '\n```'
        ];

        const goodbyer = await responder.format('emoji:info').dialog([{
            prompt: fullPrompt,
            input: { name: 'choice', type: 'string', choices: ['set', 'reset', 'show'] }
        }]);

        if (goodbyer.choice === 'set') {
            const setGoodbye = await responder.format('emoji:info').dialog([{
                prompt: [
                    'Satomi.Goodbye Set Prompt',
                    '\n```pl',
                    '\n`Please type the message you want Satomi to send when a member leaves the server`',
                    '\n',
                    '\nArgs:',
                    '\n`{{user}}` - mentions the user in that spot',
                    '\n`{{guild}}` - adds the guilds name to the message',
                    '\n',
                    '\nThis channel will be assigned as the "goodbye" channel',
                    '\nType "cancel", to exit the prompt if you do not want this',
                    '\n',
                    '\nExample Response: Goodbye {{user}}! Hope you enjoyed your stay~',
                    '\n```'
                ],
                input: { name: 'phrase', type: 'string' }
            }]);

            if (setGoodbye.phrase.length > 0) {
                client.mongodb.models.guilds.findOneAndUpdate({ serverID: msg.channel.guild.id }, { $set: { goodbye: { channelName: msg.channel.name, channelID: msg.channel.id, message: setGoodbye.phrase } } }, { new: true }, (error, g) => {
                    if (error) {
                        return responder.send(`${msg.author.mention} couldnt find server`, { embed: {
                            color: client.redColor,
                            title: 'Goodbye.Set Error',
                            description: `${error}`,
                            timestamp: new Date()
                        } }).catch(this.logger.error);
                    }

                    return responder.send(`${msg.author.mention} successfully set goodbye message`, { embed: {
                        color: client.blueColor,
                        title: 'Update Goodbye.Set Info',
                        description: 'useful info below',
                        fields: [{
                            name: '---------',
                            value: `Channel: ${g.goodbye.channelName}` +
                            `\nChannelID: ${g.goodbye.channelID}` +
                            `\nMessage: ${g.goodbye.message}`
                        }],
                        timestamp: new Date()
                    } }).catch(this.logger.error);
                }).catch(this.logger.error);
            }
        }

        if (goodbyer.choice === 'reset') {
            client.mongodb.models.guilds.findOneAndUpdate({ serverID: msg.channel.guild.id }, { $set: { goodbye: { channelName: '', channelID: '', message: '' } } }, { new: true }, (error, g) => {
                if (error) {
                    return responder.send(`${msg.author.mention} couldnt find server`, { embed: {
                        color: client.redColor,
                        title: 'Goodbye.Reset Error',
                        description: `${error}`,
                        timestamp: new Date()
                    } }).catch(this.logger.error);
                }

                return responder.send(`${msg.author.mention} successfully reset goodbye info`, { embed: {
                    color: client.blueColor,
                    title: 'Reset Goodbye Info',
                    description: 'useful info below',
                    fields: [{
                        name: '---------',
                        value: 'Channel: none' +
                        `\nChannelID: ${g.goodbye.channelID}` +
                        `\nMessage: ${g.goodbye.message}`
                    }],
                    timestamp: new Date()
                } }).catch(this.logger.error);
            }).catch(this.logger.error);
        }

        if (goodbyer.choice === 'show') {
            client.mongodb.models.guilds.findOne({ serverID: msg.channel.guild.id }, (error, g) => {
                if (error) {
                    return responder.send(`${msg.author.mention} couldnt find server`, { embed: {
                        color: client.redColor,
                        title: 'Goodbye.Show Error',
                        description: `${error}`,
                        timestamp: new Date()
                    } }).catch(this.logger.error);
                }

                return responder.format('emoji:info').send(`${msg.author.mention}`, { embed: {
                    color: client.blueColor,
                    title: 'Goodbye.Show Info',
                    description: 'useful info below',
                    fields: [{
                        name: '---------',
                        value: `Channel: ${g.goodbye.channelName || 'none'}` +
                        `\nChannelID: ${g.goodbye.channelID || 'none'}` +
                        `\nMessage: ${g.goodbye.message || 'none'}`
                    }],
                    timestamp: new Date()
                } }).catch(this.logger.error);
            }).catch(this.logger.error);
        }
    }
}

module.exports = Goodbye;

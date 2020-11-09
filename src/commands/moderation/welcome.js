const { Command } = require('sylphy');

class Welcome extends Command {
    constructor(...args) {
        super(...args, {
            name: 'welcome',
            group: 'moderation',
            cooldown: 10,
            options: { guildOnly: true, requirements: { permissions: { manageChannels: true } } }
        });
    }

    async handle ({ client, msg }, responder) {
        const fullPrompt = [
            'Satomi.Welcome Prompt',
            '```pl',
            '\n`This is the Satomi Welcome Prompt, please respond with choice you want to do~`',
            '\n',
            '\n1. `set (to set a new welcome message for the server)`',
            '\n2. `reset (deletes all welcome settings for the server)`',
            '\n3. `show (shows the channel and message for welcomes)`',
            '\n4. `cancel (cancels the welcome prompt)`',
            '\n',
            '\nExample Response: set',
            '\n```'
        ];

        const welcomer = await responder.format('emoji:info').dialog([{
            prompt: fullPrompt,
            input: { name: 'choice', type: 'string', choices: ['set', 'reset', 'show'] }
        }]);

        if (welcomer.choice === 'set') {
            const setWelcome = await responder.format('emoji:info').dialog([{
                prompt: [
                    'Satomi.Welcome Set Prompt',
                    '\n```pl',
                    '\n`Please type the message you want Satomi to send when a new member joins the server`',
                    '\n',
                    '\nArgs:',
                    '\n`{{user}}` - mentions the user in that spot',
                    '\n`{{guild}}` - adds the guilds name to the message',
                    '\n',
                    '\nThis channel will be assigned as the "welcome" channel',
                    '\nType "cancel", to exit the prompt if you do not want this',
                    '\n',
                    '\nExample Response: Welcome to {{guild}}, {{user}}! Please enjoy your stay~',
                    '\n```'
                ],
                input: { name: 'phrase', type: 'string' }
            }]);

            if (setWelcome.phrase.length > 0) {
                client.mongodb.models.guilds.findOneAndUpdate({ serverID: msg.channel.guild.id }, { $set: { welcome: { channelName: msg.channel.name, channelID: msg.channel.id, message: setWelcome.phrase } } }, { new: true }, (error, g) => {
                    if (error) {
                        return responder.send(`${msg.author.mention} couldnt find server`, { embed: {
                            color: client.redColor,
                            title: 'Welcome.Set Error',
                            description: `${error}`,
                            timestamp: new Date()
                        } }).catch(this.logger.error);
                    }

                    return responder.send(`${msg.author.mention} successfully set welcome message`, { embed: {
                        color: client.blueColor,
                        title: 'Update Welcome.Set Info',
                        description: 'useful info below',
                        fields: [{
                            name: '---------',
                            value: `Channel: ${g.welcome.channelName}` +
                            `\nChannelID: ${g.welcome.channelID}` +
                            `\nMessage: ${g.welcome.message}`
                        }],
                        timestamp: new Date()
                    } }).catch(this.logger.error);
                }).catch(this.logger.error);
            }
        }

        if (welcomer.choice === 'reset') {
            client.mongodb.models.guilds.findOneAndUpdate({ serverID: msg.channel.guild.id }, { $set: { welcome: { channelName: '', channelID: '', message: '' } } }, { new: true }, (error, g) => {
                if (error) {
                    return responder.send(`${msg.author.mention} couldnt find server`, { embed: {
                        color: client.redColor,
                        title: 'Welcome.Reset Error',
                        description: `${error}`,
                        timestamp: new Date()
                    } }).catch(this.logger.error);
                }

                return responder.send(`${msg.author.mention} successfully reset welcome info`, { embed: {
                    color: client.blueColor,
                    title: 'Reset Welcome Info',
                    description: 'useful info below',
                    fields: [{
                        name: '---------',
                        value: 'Channel: none' +
                        `\nChannelID: ${g.welcome.channelID}` +
                        `\nMessage: ${g.welcome.message}`
                    }],
                    timestamp: new Date()
                } }).catch(this.logger.error);
            }).catch(this.logger.error);
        }

        if (welcomer.choice === 'show') {
            client.mongodb.models.guilds.findOne({ serverID: msg.channel.guild.id }, (error, g) => {
                if (error) {
                    return responder.send(`${msg.author.mention} couldnt find server`, { embed: {
                        color: client.redColor,
                        title: 'Welcome.Show Error',
                        description: `${error}`,
                        timestamp: new Date()
                    } }).catch(this.logger.error);
                }

                return responder.format('emoji:info').send(`${msg.author.mention}`, { embed: {
                    color: client.blueColor,
                    title: 'Welcome.Show Info',
                    description: 'useful info below',
                    fields: [{
                        name: '---------',
                        value: `Channel: ${g.welcome.channelName || 'none'}` +
                        `\nChannelID: ${g.welcome.channelID || 'none'}` +
                        `\nMessage: ${g.welcome.message || 'none'}`
                    }],
                    timestamp: new Date()
                } }).catch(this.logger.error);
            }).catch(this.logger.error);
        }
    }
}

module.exports = Welcome;

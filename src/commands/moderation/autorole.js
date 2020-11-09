const { Command } = require('sylphy');

class AutoRole extends Command {
    constructor(...args) {
        super(...args, {
            name: 'autorole',
            group: 'moderation',
            cooldown: 10,
            options: { guildOnly: true, requirements: { permissions: { manageChannels: true } } },
            usage: [
                { name: 'options', displayName: 'options', type: 'string', optional: true, last: false },
                { name: 'roleName', displayName: 'roleName', type: 'string', optional: true, last: true }
            ]
        });
    }

    handle ({ args, client, msg }, responder) {
        const options = args.options;
        const roleName = args.roleName;

        if (!options) {
            return responder.send(`${msg.author.mention} please add the options before the role name`).catch(this.logger.error);
        }

        if (options === 'add' && !roleName) {
            return responder.send(`${msg.author.mention} please add the role name after the options`).catch(this.logger.error);
        }

        const getRoleID = () => msg.channel.guild.roles.find(r => r.name === `${roleName}`).id;

        const roleID = getRoleID();

        if (options === 'add') {
            client.mongodb.models.guilds.findOneAndUpdate({ serverID: msg.channel.guild.id }, { $set: { autoroleID: roleID } }, { new: true }, (error, g) => {
                if (error) {
                    return responder.send(`${msg.author.mention} couldnt add autorole`, { embed: {
                        color: client.redColor,
                        title: 'AutoRole.Add Error',
                        description: `${error}`,
                        timestamp: new Date()
                    } }).catch(this.logger.error);
                }

                return responder.send(`${msg.author.mention} successfully added **${roleName}** as the autorole!`, { embed: {
                    color: client.blueColor,
                    title: 'Added AutoRole Info',
                    description: 'useful info below',
                    fields: [{
                        name: '---------',
                        value: `Role: ${roleName}` +
                        `\nServer: ${msg.channel.guild.name} (${msg.channel.guild.id})` +
                        `\nRole ID: ${g.autoroleID}`
                    }],
                    timestamp: new Date()
                } }).catch(this.logger.error);
            }).catch(this.logger.error);
        }

        if (options === 'remove') {
            client.mongodb.models.guilds.findOneAndUpdate({ serverID: msg.channel.guild.id }, { $set: { autoroleID: '' } }, { new: true }, (error, g) => {
                if (error) {
                    return responder.send(`${msg.author.mention} couldnt remove autorole`, { embed: {
                        color: client.redColor,
                        title: 'AutoRole.Remove Error',
                        description: `${error}`,
                        timestamp: new Date()
                    } }).catch(this.logger.error);
                }

                return responder.send(`${msg.author.mention} successfully removed **${roleName}** from autorole`, { embed: {
                    color: client.redColor,
                    title: 'Removed AutoRole Info',
                    description: 'useful info below',
                    fields: [{
                        name: '---------',
                        value: `Role: ${roleName}` +
                        `\nServer: ${msg.channel.guild.name} (${msg.channel.guild.id})` +
                        `\nRole ID: ${g.autoroleID || 'none'}`
                    }],
                    timestamp: new Date()
                } }).catch(this.logger.error);
            }).catch(this.logger.error);
        }
    }
}

module.exports = AutoRole;

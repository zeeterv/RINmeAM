const { Command } = require('sylphy');

class Ssar extends Command {
    constructor(...args) {
        super(...args, {
            name: 'ssar',
            group: 'moderation',
            cooldown: 2,
            options: { guildOnly: true, requirements: { permissions: { administrator: true } } },
            usage: [
                { name: 'options', displayName: 'options', type: 'string', optional: false, last: false },
                { name: 'roleName', displayName: 'roleName', type: 'string', optional: true, last: true }
            ]
        });
    }

    handle ({ args, client, msg }, responder) {
        const options = args.options;
        const roleName = args.roleName;

        const getRoleID = () => msg.channel.guild.roles.find(r => r.name === `${roleName}`).id;

        const roleID = getRoleID();

        if (options === 'add') {
            client.mongodb.models.roles.create({ serverID: msg.channel.guild.id, roleID: roleID, roleName: roleName }, (error, add) => {
                if (error) {
                    return responder.send(`${msg.author.mention} could not add role **${add.roleName}** to the database`, { embed: {
                        color: client.redColor,
                        title: 'Ssar.Add Error',
                        description: `${error}`,
                        timestamp: new Date()
                    } }).catch(this.logger.error);
                }

                return responder.send(`${msg.author.mention} successfully added role **${add.roleName}** to the database!`, { embed: {
                    color: client.satomiColor,
                    title: 'Role Info',
                    description: 'useful info below',
                    fields: [{
                        name: '---------',
                        value: `Role: ${add.roleName}` +
                        `\nServer: ${msg.channel.guild.name} (${add.serverID})` +
                        `\nRole ID: ${add.roleID}`
                    }],
                    timestamp: new Date()
                } }).catch(this.logger.error);
            }).catch(this.logger.error);
        }

        if (options === 'remove') {
            client.mongodb.models.roles.findOneAndDelete({ serverID: msg.channel.guild.id, roleID: roleID, roleName: roleName }, (error, remove) => {
                if (error) {
                    return responder.send(`${msg.author.mention} could not remove role **${remove.roleName}** to the database`, { embed: {
                        color: client.redColor,
                        title: 'Ssar.Remove Error',
                        description: `${error}`,
                        timestamp: new Date()
                    } }).catch(this.logger.error);
                }

                return responder.send(`${msg.author.mention} successfully removed role **${remove.roleName}** from the database!`, { embed: {
                    color: client.redColor,
                    title: 'Removed Role Info',
                    description: 'useful info below',
                    fields: [{
                        name: '---------',
                        value: `Role: ${remove.roleName}` +
                        `\nServer: ${msg.channel.guild.name} (${remove.serverID})` +
                        `\nRole ID: ${remove.roleID}`
                    }],
                    timestamp: new Date()
                } }).catch(this.logger.error);
            }).catch(this.logger.error);
        }
    }
}

module.exports = Ssar;

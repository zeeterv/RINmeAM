const { Command } = require('sylphy');

class Role extends Command {
    constructor (...args) {
        super(...args, {
            name: 'role',
            group: 'basic',
            cooldown: 1,
            options: { guildOnly: true },
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
            return responder.send(`${msg.author.mention} please specify **add**, **remove** or **list** before the role name :rage:`)
            .catch(this.logger.error);
        } else if ((options === 'add' || options === 'remove') && (!roleName)) {
            return responder.send(`${msg.author.mention} please specify a role name :rage:`).catch(this.logger.error);
        }

        if (options === 'list') {
            client.mongodb.models.roles.find({ serverID: msg.channel.guild.id }, null, (error, list) => {
                if (error) {
                    return responder.send(`${msg.author.mention} couldnt display server database roles`, { embed: {
                        color: client.redColor,
                        title: 'Role.List Error',
                        description: `${error}`,
                        timestamp: new Date()
                    } }).catch(this.logger.error);
                } else {
                    return responder.send(' ', { embed: {
                        color: client.satomiColor,
                        title: `${msg.channel.guild.name}'s Role List`,
                        fields: [{
                            name: '---------',
                            value: `${(list.map(r => r.roleName)).join(', ') || 'None'}`
                        }],
                        timestamp: new Date()
                    } }).catch(this.logger.error);
                }
            });
        }

        if (options === 'add') {
            const getRoleID = () => msg.channel.guild.roles.find(r => r.name === `${roleName}`).id;

            const roleID = getRoleID();

            const memberRoleCheck = () => {
                if (msg.member.roles.find(r => r === roleID)) {
                    return true;
                } else {
                    return false;
                }
            };

            const memberHasRole = memberRoleCheck();

            client.mongodb.models.roles.findOne({ serverID: msg.channel.guild.id, roleID: roleID, roleName: roleName }, (error, role) => {
                if (error) {
                    return responder.send(`${msg.author.mention} could not find role **${roleName}** in the database`).catch(this.logger.error);
                }

                try {
                    if (memberHasRole === true) {
                        return responder.send(' ', { embed: {
                            color: client.redColor,
                            title: 'Role Add Error',
                            description: `You already have the role **${roleName}**`
                        } }).catch(this.logger.error);
                    } else {
                        client.addGuildMemberRole(msg.channel.guild.id, msg.author.id, role.roleID)
                        .then(() => {
                            return responder.send(' ', { embed: {
                                color: client.satomiColor,
                                title: 'Role Add Success!',
                                description: `The role ${roleName} has been added to you`
                            } }).catch(this.logger.error);
                        }).catch(this.logger.error);
                    }
                } catch (error) {
                    return responder.send('uhh something went wrong or this role doesnt exit on the database >.>', { embed: {
                        color: client.redColor,
                        title: 'Role.Add Error',
                        description: `${error}`,
                        timestamp: new Date()
                    } }).catch(this.logger.error);
                }
            });
        }

        if (options === 'remove') {
            const getRoleID = () => msg.channel.guild.roles.find(r => r.name === `${roleName}`).id;

            const roleID = getRoleID();

            const memberRoleCheck = () => {
                if (msg.member.roles.find(r => r === roleID)) {
                    return true;
                } else {
                    return false;
                }
            };

            const memberHasRole = memberRoleCheck();

            try {
                if (memberHasRole === false) {
                    return responder.send(' ', { embed: {
                        color: client.redColor,
                        title: 'Role Remove Error',
                        description: 'I can\'t remove a role you dont have'
                    } }).catch(this.logger.error);
                } else {
                    client.removeGuildMemberRole(msg.channel.guild.id, msg.author.id, roleID)
                    .then(() => {
                        return responder.send(' ', { embed: {
                            color: client.satomiColor,
                            title: 'Role Remove Success!',
                            description: `The role ${roleName} has been removed from you`
                        } }).catch(this.logger.error);
                    }).catch(this.logger.error);
                }
            } catch (error) {
                return responder.send('uhh something went wrong >.>', { embed: {
                    color: client.redColor,
                    title: 'Role.Remove Error',
                    description: `${error}`,
                    timestamp: new Date()
                } }).catch(this.logger.error);
            }
        }
    }
}

module.exports = Role;

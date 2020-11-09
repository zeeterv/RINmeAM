const { Module } = require('sylphy');
const moment = require('moment');

class Clerk extends Module {
    constructor(...args) {
        super(...args, {
            name: 'clerk',
            events: {
                satomiMemberBan: 'onBan',
                satomiMemberKick: 'onKick',
                guildMemberUpdate: 'memberUpdate',
                guildMemberAdd: 'onJoin',
                guildMemberRemove: 'onLeave',
                guildBanRemove: 'onUnban',
                guildUpdate: 'guildUpdate',
                messageUpdate: 'onMessageUpdate',
                messageDelete: 'onMessageDelete',
                userUpdate: 'userUpdate'
            }
        });
    }

    init() {
        this.db = this._client.mongodb;
    }

    onJoin(guild, member) {
        this.db.models.guilds.findOne({ serverID: guild.id }, (error, server) => {
            if (error) {
                this.logger.error('Error Finding Guild Log Channel', error);
            }

            if (!server || !server.logChannel) {
                return;
            }

            this.send(`${server.logChannel}`, '', { embed: {
                color: this._client.satomiColor,
                title: '✅ User Joined!',
                description: `${member.username}#${member.discriminator}`,
                thumbnail: {
                    url: `${member.user.dynamicAvatarURL()}`
                },
                fields: [{
                    name: 'ID',
                    value: `${member.id}`
                }],
                footer: {
                    text: `${moment().format('ddd Do MMM, YYYY [at] hh:mm:ss a')}`
                }
            } });

            if (server.welcome.message.length > 0) {
                this.send(`${server.welcome.channelID}`, server.welcome.message.replace(/{{user}}/gi, member.mention).replace(/{{guild}}/gi, guild.name))
                .catch(error => this.logger.error('Error sending welcome message', error));
            }

            if (server.autoroleID.length > 0) {
                this._client.addGuildMemberRole(guild.id, member.id, server.autoroleID)
                .catch(error => this.logger.error('Error giving auto role', error));
            }
        });

        if (member.bot === false) {
            this.db.models.users.create({ serverID: guild.id, userName: member.username, userID: member.id }, (error, u) => {
                if (error || !u) {
                    this.logger.error('Error Adding User to DB', error);
                }
            });
        }
    }

    onLeave(guild, member) {
        this.db.models.guilds.findOne({ serverID: guild.id }, (error, server) => {
            if (error) {
                this.logger.error('Error Finding Guild Log Channel', error);
            }

            if (!server || !server.logChannel) {
                return;
            }

            this.send(`${server.logChannel}`, '', { embed: {
                color: this._client.redColor,
                title: '🚫 User Left!',
                description: `${member.username}#${member.discriminator}`,
                thumbnail: {
                    url: `${member.user.dynamicAvatarURL()}`
                },
                fields: [{
                    name: 'ID',
                    value: `${member.id}`
                }],
                footer: {
                    text: `${moment().format('ddd Do MMM, YYYY [at] hh:mm:ss a')}`
                }
            } });

            if (server.goodbye.message.length > 0) {
                this.send(`${server.goodbye.channelID}`, server.goodbye.message.replace(/{{user}}/gi, member.mention).replace(/{{guild}}/gi, guild.name))
                .catch(error => this.logger.error('Error sending goodbye message', error));
            }
        });
    }

    onBan(guild, user, reason) {
        this.db.models.guilds.findOne({ serverID: guild.id }, (error, server) => {
            if (error) {
                this.logger.error('Error Finding Guild Log Channel', error);
            }

            if (!server || !server.logChannel) {
                return;
            }

            this.send(`${server.logChannel}`, '', { embed: {
                color: this._client.redColor,
                title: '🔨 User Banned!',
                description: `${user.username}#${user.discriminator}`,
                thumbnail: {
                    url: `${user.dynamicAvatarURL()}`
                },
                fields: [{
                    name: 'ID',
                    value: `${user.id}`
                },
                {
                    name: 'Reason',
                    value: `${reason.length > 0 ? reason : 'Not Specified'}`
                }],
                footer: {
                    text: `${moment().format('ddd Do MMM, YYYY [at] hh:mm:ss a')}`
                }
            } });
        });
    }

    onUnban(guild, user) {
        this.db.models.guilds.findOne({ serverID: guild.id }, (error, server) => {
            if (error) {
                this.logger.error('Error Finding Guild Log Channel', error);
            }

            if (!server || !server.logChannel) {
                return;
            }

            this.send(`${server.logChannel}`, '', { embed: {
                color: 0xfcfcfc,
                title: '✅ User UnBanned!',
                description: `${user.username}#${user.discriminator}`,
                thumbnail: {
                    url: `${user.dynamicAvatarURL()}`
                },
                fields: [{
                    name: 'ID',
                    value: `${user.id}`
                }],
                footer: {
                    text: `${moment().format('ddd Do MMM, YYYY [at] hh:mm:ss a')}`
                }
            } });
        });
    }

    onKick(guild, user, reason) {
        this.db.models.guilds.findOne({ serverID: guild.id }, (error, server) => {
            if (error) {
                this.logger.error('Error Finding Guild Log Channel', error);
            }

            if (!server || !server.logChannel) {
                return;
            }

            this.send(`${server.logChannel}`, '', { embed: {
                color: this._client.redColor,
                title: '👢 User Kicked!',
                description: `${user.username}#${user.discriminator}`,
                thumbnail: {
                    url: `${user.dynamicAvatarURL()}`
                },
                fields: [{
                    name: 'ID',
                    value: `${user.id}`
                },
                {
                    name: 'Reason',
                    value: `${reason.length > 0 ? reason : 'Not Specified'}`
                }],
                footer: {
                    text: `${moment().format('ddd Do MMM, YYYY [at] hh:mm:ss a')}`
                }
            } });
        });
    }

    guildUpdate(guild, oldGuild) {
        if (guild.name !== oldGuild.name) {
            this.db.models.guilds.findOneAndUpdate({ serverID: guild.id }, { $set: { serverName: guild.name } }, (error, server) => {
                if (error) {
                    this.logger.error('Error Finding Guild', error);
                }

                if (!server || !server.logChannel) {
                    return;
                }

                this.logger.info(`[DB] ${oldGuild.name} is now ${guild.name}`);
            });
        }
    }

    memberUpdate(guild, member, oldMember) {
        this.db.models.guilds.findOne({ serverID: guild.id }, (error, server) => {
            if (error) {
                this.logger.error('Error Finding Guild Log Channel', error);
            }

            if (!server || !server.logChannel) {
                return;
            }

            if (member.nick !== oldMember.nick) {
                return this.onNickChange(member, oldMember, server);
            }

            if (member.roles.length !== oldMember.roles.length) {
                return this.onRolesUpdate(member, oldMember, server);
            }
        });
    }

    userUpdate(user, oldUser) {
        const guilds = this._client.guilds.filter(g => g.members.get(user.id) !== undefined);
        guilds.forEach(guild => {
            this.db.models.guilds.findOne({ serverID: guild.id }, (error, server) => {
                if (error) {
                    this.logger.error('Error Finding Guild Log Channel', error);
                }

                if (!server || !server.logChannel) {
                    return;
                }

                if (user.username !== oldUser.username || user.discriminator !== oldUser.discriminator) {
                    return this.onNameChange(user, oldUser, server);
                }

                if (user.avatar !== oldUser.avatar) {
                    return this.onAvatarChange(user, oldUser, server);
                }
            });
        });
    }

    onNameChange(user, oldUser, server) {
        this.db.models.users.findOneAndUpdate({ serverID: server.id, userID: user.id }, { $set: { userName: user.username, userDisc: user.discriminator } }, (error, user) => {
            if (error || !user) {
                this.logger.send('Error Finding Guild or User', error);
            }
        });

        this.send(`${server.logChannel}`, '', { embed: {
            color: this._client.blueColor,
            title: '👤 Username Changed',
            description: `${user.username}#${user.discriminator} | ${user.id}`,
            thumbnail: {
                url: `${user.dynamicAvatarURL()}`
            },
            fields: [{
                name: 'Old Username',
                value: `${oldUser.username}#${oldUser.discriminator}`
            },
            {
                name: 'New Username',
                value: `${user.username}#${user.discriminator}`
            }],
            footer: {
                text: `${moment().format('ddd Do MMM, YYYY [at] hh:mm:ss a')}`
            }
        } });
    }

    onNickChange(member, oldMember, server) {
        this.send(`${server.logChannel}`, '', { embed: {
            color: this._client.blueColor,
            title: '👥 Nickname Changed',
            description: `${member.username}#${member.discriminator} | ${member.id}`,
            thumbnail: {
                url: `${member.user.dynamicAvatarURL()}`
            },
            fields: [{
                name: 'Old Nickname',
                value: `${oldMember.nick}`
            },
            {
                name: 'New Nickname',
                value: `${member.nick}`
            }],
            footer: {
                text: `${moment().format('ddd Do MMM, YYYY [at] hh:mm:ss a')}`
            }
        } });
    }

    onRolesUpdate(member, oldMember, server) {
        if (member.roles.length > oldMember.roles.length) {
            const role = member.guild.roles.get(member.roles.find(r => oldMember.roles.indexOf(r) < 0)).name;
            this.send(`${server.logChannel}`, '', { embed: {
                color: this._client.blueColor,
                title: '⚔️ Role Added',
                description: `${member.username}#${member.discriminator} | ${member.id}`,
                thumbnail: {
                    url: `${member.user.dynamicAvatarURL()}`
                },
                fields: [{
                    name: 'Role Name',
                    value: `${role}`
                }],
                footer: {
                    text: `${moment().format('ddd Do MMM, YYYY [at] hh:mm:ss a')}`
                }
            } });
        } else {
            const role = member.guild.roles.get(oldMember.roles.find(r => member.roles.indexOf(r) < 0)).name;
            this.send(`${server.logChannel}`, '', { embed: {
                color: this._client.redColor,
                title: '⚔️ Role Removed',
                description: `${member.username}#${member.discriminator} | ${member.id}`,
                thumbnail: {
                    url: `${member.user.dynamicAvatarURL()}`
                },
                fields: [{
                    name: 'Role Name',
                    value: `${role}`
                }],
                footer: {
                    text: `${moment().format('ddd Do MMM, YYYY [at] hh:mm:ss a')}`
                }
            } });
        }
    }

    onAvatarChange(user, oldUser, server) {
        this.send(`${server.logChannel}`, '', { embed: {
            color: this._client.blueColor,
            title: '📷 Avatar Changed',
            description: `${user.username}#${user.discriminator} | ${user.id}`,
            thumbnail: {
                url: `https://cdn.discordapp.com/avatars/${user.id}/${oldUser.avatar}.jpg`
            },
            image: {
                url: `${user.dynamicAvatarURL()}`
            },
            footer: {
                text: `${moment().format('ddd Do MMM, YYYY [at] hh:mm:ss a')}`
            }
        } });
    }

    onMessageUpdate(message, oldMessage) {
        if (message.author.bot === false) {
            this.db.models.guilds.findOne({ serverID: message.channel.guild.id }, (error, server) => {
                if (error) {
                    this.logger.error('Error Finding Guild Log Channel', error);
                }

                if (!server || !server.logChannel) {
                    return;
                }

                if (!message.author || !message.channel) {
                    return;
                }

                this.send(`${server.logChannel}`, '', { embed: {
                    color: this._client.blueColor,
                    title: `📝 Message Updated in #${message.channel.name}`,
                    description: `${message.author.username}#${message.author.discriminator} | ${message.author.id}`,
                    thumbnail: {
                        url: `${message.author.dynamicAvatarURL()}`
                    },
                    fields: [{
                        name: 'Old Content',
                        value: `${oldMessage.content}`
                    },
                    {
                        name: 'New Content',
                        value: `${message.content}`
                    }],
                    footer: {
                        text: `${moment().format('ddd Do MMM, YYYY [at] hh:mm:ss a')}`
                    }
                } });
            });
        }
    }

    onMessageDelete(message) {
        this.db.models.guilds.findOne({ serverID: message.channel.guild.id }, (error, server) => {
            if (error) {
                this.logger.error('Error Finding Guild Log Channel', error);
            }

            if (!server || !server.logChannel) {
                return;
            }

            if (!message.author || !message.channel) {
                return;
            }

            this.send(`${server.logChannel}`, '', { embed: {
                color: this._client.redColor,
                title: `📝 Message Deleted in #${message.channel.name}`,
                description: `${message.author.username}#${message.author.discriminator}`,
                thumbnail: {
                    url: `${message.author.dynamicAvatarURL()}`
                },
                fields: [{
                    name: 'Content',
                    value: `${message.content}`
                }],
                footer: {
                    text: `${moment().format('ddd Do MMM, YYYY [at] hh:mm:ss a')}`
                }
            } });
        });
    }
}

module.exports = Clerk;
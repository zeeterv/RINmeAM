const { Command } = require('sylphy');

class Mute extends Command {
    constructor (...args) {
        super (...args, {
            name: 'mute',
            group: 'moderation',
            aliases: ['gag'],
            cooldown: 2,
            options: { guildOnly: true, requirements: { permissions: { voiceMuteMembers: true } } },
            usage: [
                { name: 'member', displayName: 'member', type: 'member', optional: true },
                { name: 'options', displayName: 'options', type: 'string', optional: true, last: true }
            ]
        });
    }

    async handle ({ args, client, msg }, responder) {
        const member = (await responder.selection(args.member, { mapFunc: m => `${m.user.username}#${m.user.discriminator}` }))[0];
        const options = args.options;

        if (!msg.mentions) {
            return responder.send(`${msg.author.mention}, Please mention a user to mute~! :anger:`);
        } else if (!member) {
            return;
        }

        if (member.id === msg.author.id) {
            return responder.send(`${msg.author.mention}, You cant mute yourself :anger:`);
        } else if (member.id === client.user.id) {
            return responder.send(`${msg.author.mention}, nice try`);
        }

        let muteRole = msg.channel.guild.roles.find(r => r.name === 'Satomi Mute');

        if (!muteRole) {
            try {
                muteRole = await msg.channel.guild.createRole({
                    name: 'Satomi Mute',
                    permissions: 0,
                    color: 0x171717
                }, 'for usefull reasons');

                msg.channel.guild.channels
                    .filter(ch => ch.type === 0)
                    .forEach(ch => ch.editPermission(muteRole.id, 0, 2048, 'role', 'muted role perms'));
            } catch (error) {
                this.logger.error;
                return responder.send(' ', { embed: {
                    color: client.redColor,
                    title: 'Creating Muted Role Error',
                    description: `${error}`,
                    timestamp: new Date()
                } });
            }
        }

        const memberRoleCheck = () => {
            if (member.roles.find(r => r === muteRole.id)) {
                return true;
            } else {
                return false;
            }
        };

        const memberHasRole = memberRoleCheck();

        if (!options || options === 'text') {
            if (memberHasRole === false) {
                try {
                    await msg.channel.guild.addMemberRole(member.id, muteRole.id);
                    return responder.send(' ', { embed: {
                        color: client.satomiColor,
                        title: 'Member Text Mute',
                        description: `**${member.username}#${member.discriminator}** has been **text** muted`
                    } });
                } catch (error) {
                    this.logger.error;
                    return responder.send(' ', { embed: {
                        color: client.redColor,
                        title: 'Text Mute Error',
                        description: `${error}`,
                        timestamp: new Date()
                    } });
                }
            } else {
                return responder.send(' ', { embed: {
                    color: client.redColor,
                    title: 'Cant Text Mute Member',
                    description: `**${member.username}#${member.discriminator}** is already text muted`,
                    timestamp: new Date()
                } }).catch(this.logger.error);
            }
        } else if (options === 'voice') {
            try {
                await client.editGuildMember(msg.channel.guild.id, member.id, {
                    mute: true
                }, 'Probably being annoying');
                return responder.send(' ', { embed: {
                    color: client.satomiColor,
                    title: 'Member Voice Mute',
                    description: `**${member.username}#${member.discriminator}** has been **voice** muted`
                } });
            } catch (error) {
                this.logger.error;
                return responder.send(' ', { embed: {
                    color: client.redColor,
                    title: 'Voice Mute Error',
                    description: `${error}`,
                    timestamp: new Date()
                } });
            }
        } else if (options === 'full') {
            if (memberHasRole === false) {
                try {
                    await msg.channel.guild.addMemberRole(member.id, muteRole.id);
                    await client.editGuildMember(msg.channel.guild.id, member.id, {
                        mute: true
                    }, 'Probably being annoying');
                    return responder.send(' ', { embed: {
                        color: client.satomiColor,
                        title: 'Member Full Mute',
                        description: `**${member.username}#${member.discriminator}** has been **text** and **voice** muted`
                    } });
                } catch (error) {
                    this.logger.error;
                    return responder.send(' ', { embed: {
                        color: client.redColor,
                        title: 'Full Mute Error',
                        description: `${error}`,
                        timestamp: new Date()
                    } });
                }
            } else {
                return responder.send(' ', { embed: {
                    color: client.redColor,
                    title: 'Cant Full Mute Member',
                    description: `**${member.username}#${member.discriminator}** is already text muted, please use the voice mute instead of full`,
                    timestamp: new Date()
                } }).catch(this.logger.error);
            }
        }
    }
}

module.exports = Mute;

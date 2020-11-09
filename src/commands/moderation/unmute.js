const { Command } = require('sylphy');

class Unmute extends Command {
    constructor (...args) {
        super (...args, {
            name: 'unmute',
            group: 'moderation',
            aliases: ['ungag'],
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
            return responder.send(`${msg.author.mention}, Please mention a user to unmute~! :anger:`);
        } else if (!member) {
            return;
        }

        if (member.id === msg.author.id) {
            return responder.send(`${msg.author.mention}, You cant unmute yourself :anger:`);
        } else if (member.id === client.user.id) {
            return responder.send(`${msg.author.mention}, nice try`);
        }

        const muteRole = msg.channel.guild.roles.find(r => r.name === 'Satomi Mute');

        if (!muteRole && (options === 'text' || options === 'full')) {
            return responder.send(`${msg.author.mention}, cant unmute text if the mute command was never used`);
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
            if (memberHasRole === true) {
                try {
                    await msg.channel.guild.removeMemberRole(member.id, muteRole.id);
                    return responder.send(' ', { embed: {
                        color: client.satomiColor,
                        title: 'Member Text UnMute',
                        description: `**${member.username}#${member.discriminator}** has been unmute from **text**`
                    } });
                } catch (error) {
                    this.logger.error;
                    return responder.send(' ', { embed: {
                        color: client.redColor,
                        title: 'Text UnMute Error',
                        description: `${error}`,
                        timestamp: new Date()
                    } });
                }
            } else {
                return responder.send(' ', { embed: {
                    color: client.redColor,
                    title: 'Cant Text UnMute Member',
                    description: `**${member.username}#${member.discriminator}** isnt text muted`,
                    timestamp: new Date()
                } }).catch(this.logger.error);
            }
        }

        if (options === 'voice') {
            try {
                await client.editGuildMember(msg.channel.guild.id, member.id, {
                    mute: false
                }, 'Probably not being annoying anymore');
                return responder.send(' ', { embed: {
                    color: client.satomiColor,
                    title: 'Member Voice UnMute',
                    description: `**${member.username}#${member.discriminator}** has been unmute from **voice**`
                } });
            } catch (error) {
                this.logger.error;
                return responder.send(' ', { embed: {
                    color: client.redColor,
                    title: 'Voice UnMute Error',
                    description: `${error}`,
                    timestamp: new Date()
                } });
            }
        }

        if (options === 'full') {
            if (memberHasRole === true) {
                try {
                    await msg.channel.guild.removeMemberRole(member.id, muteRole.id);
                    await client.editGuildMember(msg.channel.guild.id, member.id, {
                        mute: false
                    }, 'Probably not being annoying anymore');
                    return responder.send(' ', { embed: {
                        color: client.satomiColor,
                        title: 'Member Full UnMute',
                        description: `**${member.username}#${member.discriminator}** has been unmuted from **text** and **voice**`
                    } });
                } catch (error) {
                    this.logger.error;
                    return responder.send(' ', { embed: {
                        color: client.redColor,
                        title: 'Full UnMute Error',
                        description: `${error}`,
                        timestamp: new Date()
                    } });
                }
            } else {
                return responder.send(' ', { embed: {
                    color: client.redColor,
                    title: 'Cant Full UnMute Member',
                    description: `**${member.username}#${member.discriminator}** isnt text muted, please use \`unmute voice\` instead of full maybe`,
                    timestamp: new Date()
                } }).catch(this.logger.error);
            }
        }
    }
}

module.exports = Unmute;

const { Command } = require('sylphy');

class Census extends Command {
    constructor(...args) {
        super(...args, {
            name: 'census',
            group: 'moderation',
            cooldown: 10,
            options: { guildOnly: true, requirements: { permissions: { administrator: true } } },
            usage: [
                { name: 'options', displayName: 'options', type: 'string', optional: true }
            ]
        });
    }

    async handle ({ args, client, msg }, responder) {
        const options = args.options;

        if (options === 'guild') {
            client.mongodb.models.guilds.findOneAndUpdate({ serverID: msg.channel.guild.id }, { $set: { serverName: msg.channel.guild.name } }, (error, g) => {
                if (error) {
                    return responder.send(`${msg.author.mention} couldn't find Guild`, { embed: {
                        color: client.redColor,
                        title: 'GuildUsersDB.Update Error',
                        description: `${error}`,
                        timestamp: new Date()
                    } }).catch(this.logger.error);
                }

                return responder.send('', { embed: {
                    color: client.satomiColor,
                    title: `${g.serverName} Census - Guild`,
                    description: 'Updated all guild credentials in the database as of now',
                    timestamp: new Date()
                } }).catch(this.logger.error);
            }).catch(this.logger.error);
        }

        if (options === 'members') {
            await msg.channel.guild.members.forEach((member) => {
                if (member.bot === false) {
                    client.mongodb.models.users.findOneAndUpdate({ serverID: msg.channel.guild.id, userID: member.id }, { $set: { userName: member.username, userDisc: member.discriminator } }, (error, u) => {
                        if (error) {
                            return responder.send(`${msg.author.mention} couldn't find Guild`, { embed: {
                                color: client.redColor,
                                title: 'GuildDB.Update Error',
                                description: `${error}`,
                                timestamp: new Date()
                            } }).catch(this.logger.error);
                        }

                        if (!u) {
                            client.mongodb.models.users.create({ serverID: msg.channel.guild.id, userID: member.id, userName: member.username, userDisc: member.discriminator });
                        }
                    }).catch(this.logger.error);
                }
            });

            return responder.send('', { embed: {
                color: client.satomiColor,
                title: `${msg.channel.guild.name} Census - Members`,
                description: 'Updated all member credentials in the database as of now',
                timestamp: new Date()
            } }).catch(this.logger.error);
        }
    }
}

module.exports = Census;

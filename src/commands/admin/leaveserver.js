const { Command } = require('sylphy');
const chalk = require('chalk');

class LeaveServer extends Command {
    constructor (...args) {
        super(...args, {
            name: 'leaveserver',
            group: 'admin',
            cooldown: 0,
            options: { guildOnly: false, adminOnly: true },
            usage: [
                { name: 'serverid', displayName: 'serverid', type: 'string', optional: true, last: true }
            ]
        });
    }

    async handle ({ args, client, msg }, responder) {
        let serverid = args.serverid;

        if (!serverid) {
            serverid = msg.channel.guild.id;
        }

        if (serverid === process.env.HOME_ID) {
            return;
        }

        const leave = await responder.dialog([{
            prompt: `Are you sure you want me to leave **${serverid}** \`yes\` or \`no\``,
            input: { name: 'choice', type: 'string', choices: ['yes', 'no'] }
        }]);

        if (leave.choice === 'yes') {
            try {
                client.leaveGuild(serverid);
                this.logger.info(chalk.cyan(`[CLIENT] Satomi has left guild ${serverid}`));
                return responder.send(' ', { embed: {
                    color: client.satomiColor,
                    title: `Satomi has left guild ${serverid}`
                } });
            } catch (error) {
                this.logger.error;
                return responder.send(' ', { embed: {
                    color: client.redColor,
                    title: 'Leave Server Error',
                    description: `${error}`,
                    timestamp: new Date()
                } });
            }
        } else {
            return responder.send(`Ok, I will not leave guild **${serverid}**~ :dango:`);
        }
    }
}

module.exports = LeaveServer;

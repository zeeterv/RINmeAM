const { Command } = require('sylphy');
const chalk = require('chalk');

class Shutdown extends Command {
    constructor (...args) {
        super(...args, {
            name: 'shutdown',
            group: 'admin',
            cooldown: 0,
            options: { guildOnly: false, adminOnly: true }
        });
    }

    async handle ({ client }, responder) {
        const shutdown = await responder.dialog([{
            prompt: 'Are you sure you want me to shut down? Respond by `yes` or `no`',
            input: { name: 'choice', type: 'string', choices: ['yes', 'no'] }
        }]);

        if (shutdown.choice === 'yes') {
           this.logger.info(chalk.cyan('[CLIENT] Satomi has shut down'));
            return responder.send(' ', { embed: {
                color: client.satomiColor,
                title: ':zzz: Satomi has shut down...'
            } }).then(async () => {
                await client.mongodb.destroy();
                await client.disconnect({ reconnect: false });
            }).catch(this.logger.error);
        } else {
            return responder.send('Ok, I will not shut down~ :dango:');
        }
    }
}

module.exports = Shutdown;

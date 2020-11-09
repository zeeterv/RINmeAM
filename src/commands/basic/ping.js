const { Command } = require('sylphy');

class Ping extends Command {
    constructor (...args) {
        super(...args, {
            name: 'ping',
            group: 'basic',
            cooldown: 10,
            options: { guildOnly: true }
        });
    }

    handle ({ client, msg }, responder) {
        return responder.send(' ', { embed: {
            color: client.satomiColor,
            description: `${msg.author.mention} | **Pong! - ${msg.channel.guild.shard.latency} ms** :dango:`
        } }).catch(this.logger.error);
    }
}

module.exports = Ping;

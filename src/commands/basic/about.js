const { Command } = require('sylphy');
const pkg = require('../../../package.json');

class About extends Command {
    constructor (...args) {
        super (...args, {
            name: 'about',
            group: 'basic',
            aliases: ['info'],
            cooldown: 2,
            options: { guildOnly: true }
        });
    }

    handle ({ client }, responder) {
        const owner = client.users.get(process.env.OWNER_ID);

        return responder.send(' ', { embed: {
            title: 'Satomi, About~',
            description: 'Hello! I\'m Satomi, your next waifu and general purpose discord bot. I started out as a small project ' +
            'to learn JavaScript, but have became a fully functional bot for servers.' +
            '\n ' +
            '\nI\'m still a work in progress so please bear with me! Report any issues to the repo or ' +
            'DM Kyostra on discord or twitter. The support server isn\'t setup yet >.<',
            color: client.satomiColor,
            thumbnail: {
                url: client.user.avatarURL
            },
            fields: [{
                name: 'Developed By',
                value: 'Kyostra#6290 | Kyostra @twitter/github',
                inline: false
            },
            {
                name: 'Satomi',
                value: `Version - ${client.botVersion}` +
                '\nLanguage - JavaScript + Node.js',
                inline: false
            },
            {
                name: 'Useful Links',
                value: '[Github](https://github.com/kyostra/satomi)' +
                '\n[Trello](https://trello.com/b/TRspnxiz/satomi)',
                inline: true
            },
            {
                name: 'Built With',
                value: `[Eris - ${pkg.dependencies.eris}](https://github.com/abalabahaha/eris)` +
                `\n[Sylphy - ${pkg.dependencies.sylphy}](https://github.com/pyraxo/sylphy)`,
                inline: true
            }],
            timestamp: new Date(),
            footer: {
                icon_url: owner.avatarURL,
                text: 'Satomi © 2017 | All Rights Reserved'
            }
        } }).catch(this.logger.error);
    }
}

module.exports = About;

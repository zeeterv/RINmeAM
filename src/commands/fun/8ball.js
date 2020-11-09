const { Command } = require('sylphy');

class Eightball extends Command {
    constructor (...args) {
        super (...args, {
            name: '8ball',
            group: 'fun',
            cooldown: 3,
            options: { guildOnly: true },
            usage: [
                { name: 'question', displayName: 'question', type: 'string', optional: false, last: true }
            ]
        });
    }

    handle ({ args, client }, responder) {
        const question = args.question;

        const magicList = [
            { name: 'It is certain' },
            { name: 'It is decidedly so' },
            { name: 'Without a doubt' },
            { name: 'Yes definitely' },
            { name: 'You may rely on it' },
            { name: 'As I see it, yes' },
            { name: 'Most likely' },
            { name: 'Outlook good' },
            { name: 'Yes' },
            { name: 'Signs point to yes' },
            { name: 'Reply hazy try again' },
            { name: 'Ask again later' },
            { name: 'Better not tell you now' },
            { name: 'Cannot predict now' },
            { name: 'Concentrate and ask again' },
            { name: 'Dont count on it' },
            { name: 'My reply is no' },
            { name: 'My sources say no' },
            { name: 'Outlook not so good' },
            { name: 'Very doubtful' }
        ];

        const answer = magicList[~~(Math.random() * magicList.length)];

        return responder.send(' ', { embed: {
            color: client.satomiColor,
            title: `:question: Your Question: ${question}`,
            description: `:8ball: Answer: ${answer.name}`,
            timestamp: new Date()
        } }).catch(this.logger.error);
    }
}

module.exports = Eightball;

/* eslint-disable */

const { Command } = require('sylphy');

class Eval extends Command {
    constructor(...args) {
        super(...args, {
            name: 'eval',
            group: 'admin',
            cooldown: 0,
            options: { guildOnly: false, adminOnly: true },
            usage: [
                { name: 'eval', displayName: 'eval', type: 'string', optional: false, last: true }
            ]
        });
    }

    async handle({ args, client, msg }, responder) {
        let suffix, evaled;

        const cleanCodeBlock = (string) => {
            return string.replace(/^```.* ?/, '').replace(/```$/, '');
        };

        try {
            suffix = cleanCodeBlock(args.eval);
            evaled = eval(suffix);
        } catch (err) {
            return responder.send(
                '__**Input:**__\n```js\n' + evaled + '```\n' +
                '__**Error:**__\n```diff\n- ' + err + '```'
            );
        }

        if (typeof evaled === 'object') {
            evaled = JSON.stringify(evaled);
        }

        return responder.send(
            '__**Input:**__\n```js\n' + suffix + '```\n' +
            '__**Result:**__\n```' + evaled + '```'
        );
    }
}

module.exports = Eval;

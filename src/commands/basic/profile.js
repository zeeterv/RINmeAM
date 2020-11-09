/* eslint prefer-const: 0 */

const { Command } = require('sylphy');
const { createCanvas, Image, registerFont } = require('canvas');
const path = require('path');
const request = require('request-promise');
const { promisifyAll } = require('tsubaki');
const fs = promisifyAll(require('fs'));

class Profile extends Command {
    constructor (...args) {
        super(...args, {
            name: 'profile',
            group: 'basic',
            cooldown: 10,
            options: { guildOnly: true },
            usage: [
                { name: 'member', displayName: 'member', type: 'string', optional: true, last: true }
            ]
        });
    }

    handle ({ args, client, msg }, responder) {
        const member = args.member;
        let user;

        if (msg.mentions > 0) {
            user = msg.mentions[0].id;
        } else if (!member) {
            user = msg.author.id;
        }

        registerFont(path.join(__dirname, '..', '..', '..', 'res', 'profile', 'fonts', 'Roboto.ttf'), { family: 'Roboto' });
        registerFont(path.join(__dirname, '..', '..', '..', 'res', 'profile', 'fonts', 'NotoEmoji-Regular.ttf'), { family: 'Roboto' });

        client.mongodb.models.users.findOne({ serverID: msg.channel.guild.id, userID: user }, async (error, u) => {
            if (error || !u) {
                return responder.send(`${msg.author.mention} couldn't find Guild or User (BOTS HAVE NO PROFILES)`, { embed: {
                    color: client.redColor,
                    title: 'Profile.Find Error',
                    description: `${error}`,
                    timestamp: new Date()
                } }).catch(this.logger.error);
            }

            const memUser = msg.author || msg.mentions[0];

            const canvas = createCanvas(300, 300);
            const ctx = canvas.getContext('2d');
            const textWrapped = await this._wrapText(ctx, u.description, 110);
            const fillValue = Math.min(Math.max(u.xp / (Math.floor(u.level * 2 * 3.65 * 22) - 0), 0), 1);
            const base = new Image();
            const cond = new Image();
            const generate = () => {
                // Environment Variables
                ctx.drawImage(base, 0, 0);
                ctx.scale(1, 1);
                ctx.patternQuality = 'bilinear';
                ctx.quality = 'bilinear';
                ctx.antialias = 'subpixel';
                ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
                ctx.shadowOffsetY = 2;
                ctx.shadowBlur = 2;

                // Username
                ctx.font = '20px Roboto';
                ctx.fillStyle = '#FFFFFF';
                ctx.fillText(`${u.userName}`, 12, 173);

                // XP Bar
                ctx.font = '10px Roboto';
                ctx.textAlign = 'create';
                ctx.fillStyle = '#3498DB';
                ctx.shadowColor = 'rgba(0, 0, 0, 0)';
                ctx.fillRect(10, 191, fillValue * 135, 17);

                // XP Bar 2
                ctx.font = '13px Roboto';
                ctx.textAlign = 'center';
                ctx.fillStyle = '#333333';
                ctx.shadowColor = 'rgba(0, 0, 0, 0)';
                ctx.fillText(`XP: ${u.xp}/${Math.floor(u.level * 2 * 3.65 * 22)}`, 78, 203);

                // Level
                ctx.font = '30px Roboto';
                ctx.textAlign = 'left';
                ctx.fillStyle = '#E5E5E5';
                ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
                ctx.fillText('LVL.', 12, 238);

                // Level Number
                ctx.font = '30px Roboto';
                ctx.fillStyle = '#E5E5E5';
                ctx.fillText(u.level, 86, 238);

                // Total XP
                ctx.font = '14px Roboto';
                ctx.fillStyle = '#E5E5E5';
                ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
                ctx.fillText('Total EXP', 12, 261);

                // Total XP Number
                ctx.font = '14px Roboto';
                ctx.fillStyle = '#E5E5E5';
                ctx.fillText(Math.floor((u.level - 1) * 2 * 3.65 * 22) + u.xp, 86, 261);

                // Currency
                ctx.font = '14px Roboto';
                ctx.fillStyle = '#E5E5E5';
                ctx.fillText('Yuri', 12, 282);

                // Currency Number
                ctx.font = '14px Roboto';
                ctx.fillStyle = '#E5E5E5';
                ctx.fillText(`¥${u.currency}`, 86, 282);

                // Info title
                ctx.font = '12px Roboto';
                ctx.fillStyle = '#333333';
                ctx.shadowColor = 'rgba(0, 0, 0, 0)';
                ctx.fillText('💬 Info Box', 158, 207);

                // Info
                ctx.font = '12px Roboto';
                ctx.fillStyle = '#333333';
                textWrapped.forEach((line, i) => {
                    ctx.fillText(line, 158, (i + 18.6) * parseInt(12, 10));
                });

                // Image
                ctx.beginPath();
                ctx.arc(79, 76, 55, 0, Math.PI * 2, true);
                ctx.closePath();
                ctx.clip();
                ctx.shadowBlur = 5;
                ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
                ctx.drawImage(cond, 24, 21, 110, 110);
            };
            base.src = await fs.readFileAsync(path.join(__dirname, '..', '..', '..', 'res', 'profile', 'backgrounds', `${u ? u.background : 'default'}.png`));
            cond.src = await request({
                uri: memUser.dynamicAvatarURL('png'),
                encoding: null
            });
            generate();

            return client.createMessage(msg.channel.id, ' ', {
                file: canvas.toBuffer(),
                name: 'profile.png'
            }).catch(this.logger.error);
        }).catch(this.logger.error);
    }

    _wrapText(ctx, text, maxWidth) {
        return new Promise(resolve => {
            const words = text.split(' ');
            let lines = [];
            let line = '';

            if (ctx.measureText(text).width < maxWidth) {
                return resolve([text]);
            }

            while (words.length > 0) {
                let split = false;
                while (ctx.measureText(words[0]).width >= maxWidth) {
                    const tmp = words[0];
                    words[0] = tmp.slice(0, -1);

                    if (!split) {
                        split = true;
                        words.splice(1, 0, tmp.slice(-1));
                    } else {
                        words[1] = tmp.slice(-1) + words[1];
                    }
                }

                if (ctx.measureText(line + words[0]).width < maxWidth) {
                    line += `${words.shift()}`;
                } else {
                    lines.push(line);
                    line = '';
                }

                if (words.length === 0) {
                    lines.push(line);
                }
            }

            return resolve(lines);
        });
    }
}

module.exports = Profile;

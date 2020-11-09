const { Module } = require('sylphy');
const moment = require('moment');

class XPManager extends Module {
    constructor(...args) {
        super(...args, {
            name: 'xp:manager',
            events: {
                messageCreate: 'onMsgCreate'
            }
        });
    }

    init() {
        this.db = this._client.mongodb;
    }

    onMsgCreate(message) {
        if (message.author.bot === true) {
            return;
        }

        if (message.channel.type === 1) {
            return;
        }

        if (message.content.startsWith('s.')) {
            return;
        }

        const generateXP = () => {
            const max = 35;
            const min = 2;
            return Math.floor(Math.random() * (max - min + 1)) + min;
        };

        this.db.models.users.findOne({ serverID: message.channel.guild.id, userID: message.author.id }, (error, u) => {
            if (error || !u) {
                this.logger.error('Error finding user in DB', error);
            }

            if (u === null) {
                return;
            }

            const timely = () => {
                const currentTime = moment();
                const xpCooldown = moment(u.xpCD);

                return currentTime.diff(xpCooldown, 'minutes');
            };

            if (timely() >= 2) {
                this.db.models.users.findOneAndUpdate({ serverID: message.channel.guild.id, userID: message.author.id }, { $set: { xp: u.xp += generateXP(), xpCD: new Date() } }, (error, uu) => {
                    if (error || !uu) {
                        this.logger.error('Error adding XP to user in DB', error);
                    }

                    const xpToLevelUp = () => {
                        return Math.floor(uu.level * 2 * 3.65 * 22);
                    };

                    if (uu.xp >= xpToLevelUp()) {
                        this.db.models.users.findOneAndUpdate({ serverID: message.channel.guild.id, userID: message.author.id }, { $set: { level: uu.level += 1, xp: 0 } }, (error, uuu) => {
                            if (error || !uuu) {
                                this.logger.error('Error adding level to user in DB', error);
                            }
                        }).catch(this.logger.error);
                    }
                }).catch(this.logger.error);
            }
        }).catch(this.logger.error);
    }
}

module.exports = XPManager;
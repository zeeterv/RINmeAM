/* eslint prefer-const: 0 */

const Mongoose = require('mongoose');

let GuildSchema = new Mongoose.Schema({
    serverName: { type: String },
    serverID: { type: String, unique: true },
    welcome: { channelName: { type: String, default: '' }, channelID: { type: String, default: '' }, message: { type: String, default: '' } },
    autoroleID: { type: String, default: '' },
    goodbye: { channelName: { type: String, default: '' }, channelID: { type: String, default: '' }, message: { type: String, default: '' } },
    logChannel: { type: String, default: '' },
    starChannel: { type: String, default: '' },
    blacklist: { type: Boolean, default: false }
});

module.exports = Mongoose.model('Guilds', GuildSchema);

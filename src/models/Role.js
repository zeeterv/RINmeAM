/* eslint prefer-const: 0 */

const Mongoose = require('mongoose');

let RoleSchema = new Mongoose.Schema({
    serverID: { type: String },
    roleID: { type: String, unique: true },
    roleName: { type: String }
});

module.exports = Mongoose.model('Roles', RoleSchema);

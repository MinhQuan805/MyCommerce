const mongoose = require('mongoose');
const generate = require("../helpers/generator")
const accountSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    password: String,
    token: {
        type: String,
        default: generate.RandomString(20),
    },
    phone: String,
    avatar: String,
    role_id: String,
    status: String,
    deleted: {
        type: Boolean,
        default: false,
    },
    deletedAt: Date,
}, {timestamps: true});

const Account = mongoose.model('Account', accountSchema, "accounts");

module.exports = Account;
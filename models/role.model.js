const mongoose = require('mongoose');
var slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const roleSchema = new mongoose.Schema({
    title: String,
    description: String,
    permissions: {
        type: Array,
        default: [],
    },
    deleted: {
        type: Boolean,
        default: false,
    },
    deletedAt: Date,
}, {timestamps : true, }
);

const Role = mongoose.model('Role', roleSchema, "role");

module.exports = Role;
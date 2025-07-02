const mongoose = require('mongoose');
var slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const categorySchema = new mongoose.Schema({
    title: String,
    parent_id: {
        type: String,
        default: "",
    },
    thumbnail: String,
    status: String,
    position: Number,
    slug: { type: String, slug: "title", unique: true },
    deleted: {
        type: Boolean,
        default: false,
    },
    deletedAt: Date,
}, {timestamps: true});

const CategoryProduct = mongoose.model('CategoryProduct', categorySchema, "product-category");

module.exports = CategoryProduct;
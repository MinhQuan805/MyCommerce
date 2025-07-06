const mongoose = require('mongoose');
var slug = require('mongoose-slug-updater'); // Dùng để tạo URL thân thiện, không dấu (daca.vn/thiet-ke-logo)
mongoose.plugin(slug);

const productSchema = new mongoose.Schema({
    title: String,
    product_category_id: {
        type: String,
        default: "",
    },
    description: String,
    price: Number,
    discountPercentage: Number,
    stock: Number,
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

// mongoose.model(modelName, schema, collectionName);
// Nếu không có tham số 3 Mongoose sẽ tự động suy ra tên collection 
// bằng cách chuyển modelName sang dạng số nhiều, viết thường, ví dụ: 'Product' → 'products'.

const Product = mongoose.model('Product', productSchema, "products");

module.exports = Product;
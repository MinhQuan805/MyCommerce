const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    discountPercentage: Number,
    stock: Number,
    thumbnail: String,
    status: String,
    position: Number,
    deleted: Boolean,
});

// mongoose.model(modelName, schema, collectionName);
// Nếu không có tham số 3 Mongoose sẽ tự động suy ra tên collection 
// bằng cách chuyển modelName sang dạng số nhiều, viết thường, ví dụ: 'Product' → 'products'.

const Product = mongoose.model('Product', productSchema, "products");

module.exports = Product;
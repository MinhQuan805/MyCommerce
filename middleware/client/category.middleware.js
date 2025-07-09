const CategoryProduct = require("../../models/product-category.model");
const CreateTreeHelper = require("../../helpers/CreateTree");

module.exports.category = async (req, res, next) => {
    const records = await CategoryProduct.find({ deleted: false, });
    const newRecord = CreateTreeHelper(records);
    res.locals.productCategory = newRecord;
    next();
}

const CategoryProduct = require("../models/product-category.model");
module.exports.getSubCategory = async (parentID) => {
    const getCategory = async (parentID) => {
        const subs = await CategoryProduct.find({
            parent_id: parentID,
            status: "active",
            deleted: false,
        });
        
        let arr = [...subs];
        
        for (const sub of subs) {
            const child = await getCategory(sub.id);
            arr = arr.concat(child);
        }

        return arr;
    }

    const result = await  getCategory(parentID);
    return result;
}
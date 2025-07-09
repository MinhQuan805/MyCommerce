const Product = require("../../models/product.model");
const CategoryProduct = require("../../models/product-category.model");
const getSubCategoryHelper = require("../../helpers/product-category")
module.exports.index = async (req, res) => {
    const products = await Product.find({
        status: "active",
        deleted: false,
    }).sort({position: "desc"});

    products.forEach(item => {
        item.priceNew = (item.price*(100 - item.discountPercentage)/100).toFixed(0);
    });
    res.render("client/pages/products/index", 
        {pageTitle: "Danh Sách Sản phẩm",
        products: products
    });
}

// [GET] /products/detail/:slugProduct
module.exports.detail = async (req, res) => {
    try {
        let find = {
            deleted: false,
            slug: req.params.slugProduct,
            status: "active",
        };
        const product = await Product.findOne(find);
        product.price = product.price.toFixed(0);
        res.render(`client/pages/products/detail`, {pageTitle: product.title,
                product: product});
    }
    catch (error) {
        req.flash("error", "Không thể xem sản phẩm")
        res.redirect(`/products`)
    }
}

// [GET] /products/:slugCategory
module.exports.category = async (req, res) => {
    const category = await CategoryProduct.findOne({
        slug: req.params.slugCategory,
        deleted: false,
    });

    const listItem = await getSubCategoryHelper.getSubCategory(category.id);

    const listItemId = listItem.map((item => item.id));
    const products = await Product.find({
        product_category_id: { $in: [category.id, ...listItemId] },
        deleted: false,
    }).sort({ position: "desc" });
    products.forEach(item => {
        item.priceNew = (item.price*(100 - item.discountPercentage)/100).toFixed(0);
    });
    res.render("client/pages/products/index", {
        pageTitle: "Danh sách sản phẩm",
        products: products,
    });
}
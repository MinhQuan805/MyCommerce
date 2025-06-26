const Product = require("../../models/product.model");
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

// [GET] /client/products/:slug
module.exports.detail = async (req, res) => {
    try {
        let find = {
            deleted: false,
            slug: req.params.slug,
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
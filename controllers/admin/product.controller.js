// [GET] /admin/products
const Product = require("../../models/product.model");

const filterStatusHelpers = require("../../helpers/filterStatus");
module.exports.index = async (req, res) => {
    
    const filterStatus = filterStatusHelpers(req.query);

    let find = {
        deleted: false,
    }

    if (req.query.status) {
        find.status = req.query.status;
    }

    // Tìm kiếm
    let keyword = "";
    if (req.query.keyword) {
        keyword = req.query.keyword;

        // Dùng regex
        find.title = new RegExp(keyword, "i");
    }
    const products = await Product.find(find);
    

    //console.log(products);
    res.render("admin/pages/products/index", 
        {pageTitle: "Danh Sách Sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: keyword
    });
}
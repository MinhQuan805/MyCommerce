// [GET] /admin/products
const Product = require("../../models/product.model");

const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
module.exports.index = async (req, res) => {
    
    // Nút tìm kiếm trạng thái
    const filterStatus = filterStatusHelper(req.query);

    let find = {
        deleted: false,
    }

    if (req.query.status) {
        find.status = req.query.status;
    }

    // Tìm kiếm
    const searchObject = searchHelper(req.query);

    if (searchObject.regex) {
        find.title = searchObject.regex;
    }

    // Phân trang
    let paginationObject = {
        currentPage: 1,
        limitItem: 4,
    };
    if (req.query.page) {
        paginationObject.currentPage = parseInt(req.query.page);
    }
    paginationObject.skip = (paginationObject.currentPage - 1) * paginationObject.limitItem;
    const countProducts = await Product.countDocuments(find);
    paginationObject.totalPage = Math.ceil(countProducts/paginationObject.limitItem);

    // Chạy và truyền dữ liệu
    const products = await Product.find(find).limit(paginationObject.limitItem).skip(paginationObject.skip);
    res.render("admin/pages/products/index", 
        {pageTitle: "Danh Sách Sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: searchObject.keyword,
        pagination: paginationObject
    });
}
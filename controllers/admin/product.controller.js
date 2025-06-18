// [GET] /admin/products
const Product = require("../../models/product.model");

const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");

// [GET] /admin/products
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
    const countProducts = await Product.countDocuments(find);
    paginationObject = paginationHelper(paginationObject, req.query, countProducts);

    // Xóa sản phẩm
    
    // Chạy và truyền dữ liệu
    const products = await Product.find(find)
                                .sort({position: "desc"}) // Sort theo vị trí
                                .limit(paginationObject.limitItem).skip(paginationObject.skip);
    res.render("admin/pages/products/index", 
        {pageTitle: "Danh Sách Sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: searchObject.keyword,
        pagination: paginationObject
    });
}

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;

    await Product.updateOne({ _id: id }, { status: status });

    // Quay về trang trước
    backURL=req.header('Referer') || '/'
    res.redirect(backURL);
}

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(', ');

    switch (type) {
        case "active":
            await Product.updateMany({ _id: { $in: ids }}, { status: "active"});
            break;
        case "inactive":
            await Product.updateMany({ _id: { $in: ids }}, { status: "inactive"});
            break;
        case "delete-all":
            await Product.updateMany({ _id: { $in: ids }}, { deleted: true, deletedAt: new Date() });
            break;
        case "change-position":
            for (const item of ids) {
                let [id, pos] = item.split('-');
                pos = parseInt(pos);
                await Product.updateMany({ _id: id }, { position:  pos})
            }
        default:
            break;
    }
    // Quay về trang trước
    backURL=req.header('Referer') || '/'
    res.redirect(backURL);
}

// [PATCH] /admin/products/form-delete
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;
    
    // Xóa cứng
    // await Product.deleteOne({ _id: id });

    // Xóa mềm (Xóa vẫn còn lưu trữ trong database)
    // deleteAt dùng để biết được ai xóa khi nào
    await Product.updateOne({ _id: id }, { deleted: true, deletedAt: new Date() });

    // Quay về trang trước
    backURL=req.header('Referer') || '/'
    res.redirect(backURL);
}
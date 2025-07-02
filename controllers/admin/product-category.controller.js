// [GET] /admin/product-category
const CategoryProduct = require("../../models/product-category.model");

const systemConfig = require("../../config/system");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");

// [GET] /admin/product-category
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
    const countProducts = await CategoryProduct.countDocuments(find);
    paginationObject = paginationHelper(paginationObject, req.query, countProducts);
    
    // Sort theo tùy chọn
    let sort = {};

    if (req.query.sortkey && req.query.sortvalue) {
        sort[req.query.sortkey] = req.query.sortvalue;
    }
    else {
        sort.position = "desc";
    }
    // Chạy và truyền dữ liệu
    const records = await CategoryProduct.find(find).limit(paginationObject.limitItem).sort(sort).skip(paginationObject.skip);
    res.render("admin/pages/product-category/index", 
        {pageTitle: "Danh Sách Sản phẩm",
        records: records,
        filterStatus: filterStatus,
        keyword: searchObject.keyword,
        pagination: paginationObject
    });
}

// [PATCH] /admin/product-category/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;

    await CategoryProduct.updateOne({ _id: id }, { status: status });

    req.flash("success", "Cập nhật trạng thái thành công!");
    // Quay về trang trước
    backURL=req.header('Referer') || '/'
    res.redirect(backURL);
}

// [PATCH] /admin/product-category/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(', ');
    switch (type) {
        case "active":
            await CategoryProduct.updateMany({ _id: { $in: ids }}, { status: "active"});
            req.flash("success", `Cập nhật trạng thái thành công ${ids.length}!`);
            break;
        case "inactive":
            await CategoryProduct.updateMany({ _id: { $in: ids }}, { status: "inactive"});
            req.flash("success", `Cập nhật trạng thái thành công ${ids.length}!`);
            break;
        case "delete-all":
            await CategoryProduct.updateMany({ _id: { $in: ids }}, { deleted: true, deletedAt: new Date() });
            req.flash("success", `Xóa thành công ${ids.length}!`);
            break;
        case "change-position":
            for (const item of ids) {
                let [id, pos] = item.split('-');
                pos = parseInt(pos);
                await CategoryProduct.updateMany({ _id: id }, { position:  pos})
            }
            req.flash("success", `Thay đổi vị trí thành công ${ids.length}!`);
            break;
        default:
            break;
    }
    // Quay về trang trước
    backURL=req.header('Referer') || '/'
    res.redirect(backURL);
}

// [DELETE] /admin/product-category/form-delete
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;

    await Product.updateOne({ _id: id }, { deleted: true, deletedAt: new Date() });
    req.flash("success", `Xóa thành công!`);
    // Quay về trang trước
    backURL=req.header('Referer') || '/'
    res.redirect(backURL);
}

// [GET] /admin/product-category/create
module.exports.create = async (req, res) => {
    res.render("admin/pages/product-category/create", 
        {pageTitle: "Tạo mới sản phẩm",
    });
}

// [POST] /admin/product-category/create
module.exports.createPost = async (req, res) => {
    if (req.body.position == "") {
        const countProducts = await CategoryProduct.countDocuments();
        req.body.position = countProducts + 1;
    }
    else {
        req.body.position = parseInt(req.body.position);
    }

    
    // Thêm dữ liệu vào database
    const newProduct = new Product(req.body);
    await newProduct.save();

    res.redirect(`${systemConfig.prefixAdmin}/product-category`);
}

// [GET] /admin/product-category/edit/:id
module.exports.edit = async (req, res) => {
    const id = req.params.id;
    try {
        let find = {
            deleted: false,
            _id: id,
        };
        const product = await CategoryProduct.findOne(find);
        res.render(`admin/pages/product-category/edit`, 
                {pageTitle: "Chỉnh sửa sản phẩm",
                product: product,
        });
    }
    catch (error) {
        req.flash("error", "Lỗi đường dẫn không kết nối được!")
        res.redirect(`${systemConfig.prefixAdmin}/product-category`);
    }
}

// [PATCH] /admin/product-category/edit/:id
module.exports.editPost = async (req, res) => {
    const id = req.params.id;
    req.body.position = parseInt(req.body.position);
    const up = req.body;
    // Thêm dữ liệu vào database
    try {
        await CategoryProduct.updateOne({ _id: id }, req.body);
        req.flash("success", "Cập nhật thành công sản phẩm! ");
    }
    catch (error) {
        req.flash("error", "Cập nhật thất bại!");
    }
    res.redirect(`${systemConfig.prefixAdmin}/product-category`);
}

// [GET] /admin/product-category/detail/:id
module.exports.detail = async (req, res) => {
    const id = req.params.id;
    try {
        let find = {
            deleted: false,
            _id: id,
        };
        const product = await CategoryProduct.findOne(find);
        res.render(`admin/pages/product-category/detail`, {pageTitle: "Chi tiết sản phẩm",
                product: product});
    }
    catch (error) {
        req.flash("error", "Không thể xem sản phẩm")
        res.redirect(`${systemConfig.prefixAdmin}/product-category`)
    }
}
// [GET] /admin/product-category
const CategoryProduct = require("../../models/product-category.model");

const systemConfig = require("../../config/system");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const CreateTreeHelper = require("../../helpers/CreateTree");

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
    
    // Chạy và truyền dữ liệu
    const records = await CategoryProduct.find(find);
    const newRecords = CreateTreeHelper(records);
    res.render("admin/pages/product-category/index", 
        {pageTitle: "Danh mục Sản phẩm",
        records: newRecords,
        filterStatus: filterStatus,
        keyword: searchObject.keyword,
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
            req.flash("success", `Cập nhật trạng thái thành công ${ids.length} danh mục!`);
            break;
        case "inactive":
            await CategoryProduct.updateMany({ _id: { $in: ids }}, { status: "inactive"});
            req.flash("success", `Cập nhật trạng thái thành công ${ids.length} danh mục!`);
            break;
        case "delete-all":
            //await CategoryProduct.deleteMany({ _id: { $in: ids } });
            await CategoryProduct.updateMany({ _id: { $in: ids }}, { deleted: true, deletedAt: new Date() });
            req.flash("success", `Xóa thành công ${ids.length} danh mục!`);
            break;
        case "change-position":
            for (const item of ids) {
                let [id, pos] = item.split('-');
                pos = parseInt(pos);
                await CategoryProduct.updateMany({ _id: id }, { position:  pos})
            }
            req.flash("success", `Thay đổi vị trí thành công ${ids.length} danh mục!`);
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

    // Xóa cứng
    await CategoryProduct.deleteOne({ _id: id });

    //Xóa mềm
    //await CategoryProduct.updateOne({ _id: id }, { deleted: true, deletedAt: new Date() });
    req.flash("success", `Xóa thành công!`);
    // Quay về trang trước
    backURL=req.header('Referer') || '/'
    res.redirect(backURL);
}

// [GET] /admin/product-category/create
module.exports.create = async (req, res) => {
    let find = {
        deleted: "false",
    }
    const records = await CategoryProduct.find(find);
    const hierarchy = CreateTreeHelper(records);

    res.render("admin/pages/product-category/create", 
        {pageTitle: "Tạo mới sản phẩm",
        records: hierarchy,
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
    console.log(req.body);
    // Thêm dữ liệu vào database
    const records = new CategoryProduct(req.body);
    await records.save();

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
        const data = await CategoryProduct.findOne(find);
        
        const records = await CategoryProduct.find({
            deleted: false,
        });

        const newRecords = CreateTreeHelper(records);
        res.render(`admin/pages/product-category/edit`, 
            {pageTitle: "Chỉnh sửa danh mục sản phẩm",
            data: data,
            records: newRecords,
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
    // Thêm dữ liệu vào database
    try {
        await CategoryProduct.updateOne({ _id: id }, req.body);
        req.flash("success", "Cập nhật thành công danh mục! ");
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
        const data = await CategoryProduct.findOne(find);
        res.render(`admin/pages/product-category/detail`, {pageTitle: "Chi tiết danh mục",
                data: data});
    }
    catch (error) {
        req.flash("error", "Không thể xem danh mục")
        res.redirect(`${systemConfig.prefixAdmin}/product-category`)
    }
}
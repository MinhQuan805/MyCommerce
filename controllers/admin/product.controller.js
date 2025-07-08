// [GET] /admin/products
const Product = require("../../models/product.model");
const CategoryProduct = require("../../models/product-category.model");
const Account = require("../../models/account.model");
const systemConfig = require("../../config/system");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const CreateTreeHelper = require("../../helpers/CreateTree");

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
    // Sort theo tùy chọn
    let sort = {};

    if (req.query.sortkey && req.query.sortvalue) {
        sort[req.query.sortkey] = req.query.sortvalue;
    }
    else {
        sort.position = "desc";
    }
    
    // Chạy và truyền dữ liệu
    const products = await Product.find(find).limit(paginationObject.limitItem)
                                            .sort(sort).skip(paginationObject.skip);
    products.forEach(item => {
        item.price = item.price.toFixed(0);
    });

    for (const product of products) {
        const user = await Account.findOne({
            _id: product.createdBy.account_id,
        });
        if (user) {
            product.fullName = user.fullName;
        }
    }
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

    const updated = {
            account_id: res.locals.user.id,
            updatedAt: new Date(),
    }

    await Product.updateOne({ _id: id }, { 
        status: status,
        $push: { updatedBy: updated }
     });

    req.flash("success", "Cập nhật trạng thái thành công!");
    // Quay về trang trước
    backURL=req.header('Referer') || '/'
    res.redirect(backURL);
}

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(', ');
    const updated = {
        account_id: res.locals.user.id,
        updatedAt: new Date(),
    }
    switch (type) {
        case "active":
            await Product.updateMany({ _id: { $in: ids }}, { 
                status: "active", $push: { updatedBy: updated }});
            req.flash("success", `Cập nhật trạng thái thành công ${ids.length} sản phẩm!`);
            break;
        case "inactive":
            await Product.updateMany({ _id: { $in: ids }}, 
                { status: "inactive", 
                    $push: { updatedBy: updated } });
            req.flash("success", `Cập nhật trạng thái thành công ${ids.length} sản phẩm!`);
            break;
        case "delete-all":
            await Product.deleteMany({ _id: { $in: ids }}, { deleted: true, 
                deletedBy: {
                    account_id: res.locals.user.id,
                    deletedAt: new Date(),
                }});
            req.flash("success", `Xóa thành công ${ids.length} sản phẩm!`);
            break;
        case "change-position":
            for (const item of ids) {
                let [id, pos] = item.split('-');
                pos = parseInt(pos);
                await Product.updateMany({ _id: id }, 
                                        { position:  pos, 
                                        $push: { updatedBy: updated }})
            }
            req.flash("success", `Thay đổi vị trí thành công ${ids.length} sản phẩm!`);
            break;
        default:
            break;
    }
    // Quay về trang trước
    backURL=req.header('Referer') || '/'
    res.redirect(backURL);
}

// [DELETE] /admin/products/form-delete
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;
    
    // Xóa cứng
    // await Product.deleteOne({ _id: id });

    // Xóa mềm (Xóa vẫn còn lưu trữ trong database)
    // deleteAt dùng để biết được ai xóa khi nào
    await Product.updateOne({ _id: id }, { deleted: true, 
        deletedBy: {
            account_id: res.locals.user.id,
            deletedAt: new Date(),
        }});
    req.flash("success", `Xóa thành công!`);
    // Quay về trang trước
    backURL=req.header('Referer') || '/'
    res.redirect(backURL);
}

// [GET] /admin/products/create
module.exports.create = async (req, res) => {
    let find = {
        deleted: "false",
    }
    const records = await CategoryProduct.find(find);
    const hierarchy = CreateTreeHelper(records);
    res.render("admin/pages/products/create", 
        {pageTitle: "Tạo mới sản phẩm",
        category: hierarchy,
    });
}

// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    if (req.body.position == "") {
        const countProducts = await Product.countDocuments();
        req.body.position = countProducts + 1;
    }
    else {
        req.body.position = parseInt(req.body.position);
    }
    req.body.createdBy = {
        account_id: res.locals.user.id,
        createBy: new Date,
    }
    // Thêm dữ liệu vào database
    const newProduct = new Product(req.body);
    await newProduct.save();

    res.redirect(`${systemConfig.prefixAdmin}/products`);
}

// [GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
    const id = req.params.id;
    try {
        let find = {
            deleted: false,
            _id: id,
        };
        const product = await Product.findOne(find);

        const category = await CategoryProduct.find({
            deleted: false,
        });

        newCategory = CreateTreeHelper(category);
        res.render(`admin/pages/products/edit`, 
            {pageTitle: "Chỉnh sửa sản phẩm",
            product: product,
            category: newCategory,
        });
    }
    catch (error) {
        req.flash("error", "Lỗi đường dẫn không kết nối được!")
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
}

// [PATCH] /admin/products/edit/:id
module.exports.editPost = async (req, res) => {
    const id = req.params.id;
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    req.body.position = parseInt(req.body.position);
    req.body.editBy = editBy;
    // Thêm dữ liệu vào database
    try {
        const updated = {
            account_id: res.locals.user.id,
            updatedAt: new Date(),
        }
        await Product.updateOne({ _id: id }, {
            ...req.body,
            $push: { updatedBy: updated }
        });
        req.flash("success", "Cập nhật thành công sản phẩm! ");
    }
    catch (error) {
        req.flash("error", "Cập nhật thất bại!");
    }
    res.redirect(`${systemConfig.prefixAdmin}/products`);
}

// [GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
    const id = req.params.id;
    try {
        let find = {
            deleted: false,
            _id: id,
        };
        const product = await Product.findOne(find);
        product.price = product.price.toFixed(0);
        res.render(`admin/pages/products/detail`, {pageTitle: "Chi tiết sản phẩm",
                product: product});
    }
    catch (error) {
        req.flash("error", "Không thể xem sản phẩm")
        res.redirect(`${systemConfig.prefixAdmin}/products`)
    }
}
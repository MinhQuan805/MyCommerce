
const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
const systemConfig = require("../../config/system");
var md5 = require('md5');

// [GET] /admin/account/
module.exports.index = async (req, res) => {
    let accounts = await Account.find({
        deleted: false,
    }).select("-password -token");

    let roles = await Role.find({
        deleted: false,
    })
    res.render("admin/pages/account/index", {
        pageTitle: "Danh sách tài khoản",
        accounts: accounts,
        roles: roles,
    });
}

// [GET] /admin/account/create
module.exports.create = async (req, res) => {
    let roles = await Role.find({
        deleted: false,
    })
    res.render("admin/pages/account/create", 
        {pageTitle: "Tạo mới tài khoản",
        roles: roles,
    });
}

// [POST] /admin/account/create
module.exports.createPost = async (req, res) => {
    const emailExist = await Account.findOne({
        email: req.body.email,
        deleted: false,
    });
    if (emailExist) {
        req.flash("error", `Tài khoản ${req.body.email} đã tồn tại!`);
        backURL=req.header('Referer') || '/'
        res.redirect(backURL);
    }
    else {
        req.body.password = md5(req.body.password);
        const newAccount = new Account(req.body);
        await newAccount.save();
        res.redirect(`${systemConfig.prefixAdmin}/account`);
    }
}

// [GET] /admin/account/edit/:id
module.exports.edit = async (req, res) => {
    try {
        let account = await Account.findOne({
            _id: req.params.id,
            deleted: false,
        })
        let roles = await Role.find({
            deleted: false,
        })
        res.render("admin/pages/account/edit", 
            {pageTitle: "Chỉnh sửa tài khoản",
            roles: roles,
            account: account,
        });
    }
    catch (error) {
        req.flash("error", "Lỗi đường dẫn không kết nối được!")
        res.redirect(`${systemConfig.prefixAdmin}/account`);
    }
}

// [POST] /admin/account/edit/:id
module.exports.editPost = async (req, res) => {
    console.log(req.body);
    const id = req.params.id;
    const emailExist = await Account.findOne({
        _id: { $ne: id }, // Tìm các email khác với email hiện tại 
        email: req.body.email,
        deleted: false,
    });
    if (emailExist) {
        req.flash("error", `Tài khoản ${req.body.email} đã tồn tại!`);
        backURL=req.header('Referer') || '/'
        res.redirect(backURL);
    }
    else {
        if (req.body.password) {
            req.body.password = md5(req.body.password);
        }
        else {
            delete req.body.password;
        }
        try {
            await Account.updateOne({ _id: id }, req.body);
            req.flash("success", "Cập nhật thành công tài khoản! ");
            res.redirect(`${systemConfig.prefixAdmin}/account`);
        }
        catch (error) {
            req.flash("error", "Cập nhật thất bại!");
            backURL=req.header('Referer') || '/'
            res.redirect(backURL);
        }
    }
}

// [PATCH] /admin/account/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;

    await Account.updateOne({ _id: id }, { status: status });

    req.flash("success", "Cập nhật trạng thái thành công!");
    // Quay về trang trước
    backURL=req.header('Referer') || '/'
    res.redirect(backURL);
}

// [DELETE] /admin/account/form-delete
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;
    
    await Account.updateOne({ _id: id }, { deleted: true, deletedAt: new Date() });
    req.flash("success", `Xóa thành công!`);

    // Quay về trang trước
    backURL=req.header('Referer') || '/'
    res.redirect(backURL);
}
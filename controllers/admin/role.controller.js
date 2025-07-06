const Role = require("../../models/role.model");
const systemConfig = require("../../config/system");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const { get } = require("mongoose");

module.exports.index =  async (req, res) => {
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

    const roles = await Role.find(find).limit(paginationObject.limitItem).skip(paginationObject.skip);
    res.render("admin/pages/role/index.pug",
        {
            roles: roles,
            filterStatus: filterStatus,
            keyword: searchObject.keyword,
            pagination: paginationObject
        }
    );
}

// [GET] /admin/role/create
module.exports.create = async (req, res) => {
    res.render("admin/pages/role/create.pug", {
        pageTitle: "Tạo nhóm quyền",
    });
}

// [POST] /admin/role/create
module.exports.createPost = async (req, res) => {
    const newRole = new Role(req.body);
    await newRole.save();
    res.redirect(`${systemConfig.prefixAdmin}/role`);
}

// [GET] /admin/role/edit/:id
module.exports.edit = async (req, res) => {
    const id = req.params.id;
    try {
        let find = {
            deleted: false,
            _id: id,
        };
        const role = await Role.findOne(find);

        res.render(`admin/pages/role/edit`, 
            {pageTitle: "Chỉnh sửa sản phẩm",
            role: role,
        });
    }
    catch (error) {
        req.flash("error", "Lỗi đường dẫn không kết nối được!")
        res.redirect(`${systemConfig.prefixAdmin}/role`);
    }
}

// [PATCH] /admin/role/edit/:id
module.exports.editPost = async (req, res) => {
    const id = req.params.id;
    // Thêm dữ liệu vào database
    try {
        await Role.updateOne({ _id: id }, req.body);
        req.flash("success", "Cập nhật thành công sản phẩm! ");
    }
    catch (error) {
        req.flash("error", "Cập nhật thất bại!");
    }
    res.redirect(`${systemConfig.prefixAdmin}/role`);
}

// [GET] /admin/role/permissions
module.exports.permissions = async (req, res) => {
    let find = {
        deleted: false,
    };

    const records = await Role.find(find);
    
    res.render("admin/pages/role/permissions.pug", {
        pageTitle: "Phân quyền",
        records: records,
    })
}

// [PATCH] /admin/role/permissions
module.exports.permissionsPatch = async (req, res) => {
    const permissions = JSON.parse(req.body.permissions);
    for (const item of permissions) {
        const id = item.id;
        await Role.updateOne({ _id: id }, {permissions: item.permissions} );
    }
    backURL=req.header('Referer') || '/'
    res.redirect(backURL);
}
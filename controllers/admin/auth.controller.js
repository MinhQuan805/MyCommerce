const Account = require("../../models/account.model");
const systemConfig = require("../../config/system");
var md5 = require('md5');

// [GET] /admin/auth/login
module.exports.login = (req, res) => {
    if (req.cookies.token) {
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    }
    else {
        res.render("admin/pages/auth/login", {
            pageTitle: "Trang đăng nhập",
        });
    }
}

// [POST] /admin/auth/login
module.exports.loginAuth = async (req, res) => {
    let user = await Account.findOne({
        email: req.body.email,
        deleted: false,
    });

    if (!user) {
        req.flash("error", "Email chưa được đăng ký")
        backURL=req.header('Referer') || '/'
        res.redirect(backURL);
        return;
    }
    if (user.password != md5(req.body.password)) {
        req.flash("error", "Mật khẩu không chính xác")
        backURL=req.header('Referer') || '/'
        res.redirect(backURL);
        return;
    }
    
    if (user.status == "inactive") {
        req.flash("error", "Tài khoản đã bị khóa")
        backURL=req.header('Referer') || '/'
        res.redirect(backURL);
        return;
    }

    res.cookie("token", user.token);
    res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
}

module.exports.logout = async (req, res) => {
    res.clearCookie("token");
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
}
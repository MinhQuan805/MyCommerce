module.exports.Account = (req, res, next) => {
    if (!req.body.fullName) {
        req.flash("error", "Vui lòng nhập tên!");
        backURL = req.header("Referer") || "/";
        res.redirect(backURL);
        return;
    }
    if (!req.body.password) {
        req.flash("error", "Vui lòng nhập mật khẩu!");
        backURL = req.header("Referer") || "/";
        res.redirect(backURL);
        return;
    }
    if (!req.body.email) {
        req.flash("error", "Vui lòng nhập tài khoản email!");
        backURL = req.header("Referer") || "/";
        res.redirect(backURL);
        return;
    }
    next();
};

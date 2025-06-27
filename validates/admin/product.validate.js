module.exports.createProduct = (req, res, next) => {
    if (!req.body.title) {
        req.flash("error", "Vui lòng nhập tiêu đề!");
        backURL = req.header("Referer") || "/";
        res.redirect(backURL);
        return;
    }
    next();
};

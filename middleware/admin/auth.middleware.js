const Account = require("../../models/account.model");
const systemConfig = require("../../config/system");

module.exports.requireAuth = async (req, res, next) => {
    const user = await Account.findOne({
        token: req.cookies.token,
        deleted: false,
    })
    if (!user) {
        res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
        return;
    }
    next();
}
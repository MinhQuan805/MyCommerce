const Account = require("../../models/account.model");
const Role = require("../../models/role.model");

const systemConfig = require("../../config/system");

module.exports.requireAuth = async (req, res, next) => {
    if (!req.cookies.token) {
        res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    }
    else {
        const user = await Account.findOne({
            token: req.cookies.token,
            deleted: false,
        }).select("-password");
        if (!user) {
            res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
            return;
        }
        else {
            const role = await Role.findOne({
                _id: user.role_id,
            });
            res.locals.role = role;
            res.locals.user = user;
            next();
        }
    }
}
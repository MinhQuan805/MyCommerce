const Account = require("../../models/account.model");
const systemConfig = require("../../config/system");
module.exports.dashboard = async (req, res) => {
    res.render("admin/pages/dashboard/index", 
            {pageTitle: "Trang Tổng Quan"
    });
}
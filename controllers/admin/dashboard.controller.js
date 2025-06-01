module.exports.dashboard = async (req, res) => {
    res.render("admin/pages/dashboard/index", 
        {Title: "Trang Tổng Quan"
    });
}
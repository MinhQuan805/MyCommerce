const User = require("../../models/user.model");
const ForgotPassword = require("../../models/forgotPassword.model");
const generate = require('../../helpers/generator');
const sendMailHelper = require('../../helpers/sendMail');
var md5 = require("md5");
// [GET] user/register
module.exports.register = async (req, res) => {
    res.render("client/pages/user/register", 
        { pageTitle: "Trang đăng ký"}
    );
}

// [POST] user/register
module.exports.registerPost = async (req, res) => {
    const emailExist = await User.findOne({
        email: req.body.email,
    });
    if (emailExist) {
        req.flash("error", "Email đã tồn tại!");
        backURL = req.header("Referer") || "/";
        res.redirect(backURL);
        return;
    }
    req.body.password = md5(req.body.password);
    const newUser = new User(req.body);
    await newUser.save();
    res.cookie('tokenUser', newUser.tokenUser);
    res.redirect("/");
}

// [GET] /client/user/login
module.exports.login = (req, res) => {
    if (req.cookies.tokenUser) {
        res.redirect(`/`);
    }
    else {
        res.render("client/pages/user/login", {
            pageTitle: "Trang đăng nhập",
        });
    }
}

// [POST] /client/user/login
module.exports.loginPost = async (req, res) => {
    let user = await User.findOne({
        email: req.body.email,
        deleted: false,
    });

    if (!user) {
        req.flash("error", "Email không tồn tại")
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

    res.cookie("tokenUser", user.tokenUser);
    res.redirect("/");
}

module.exports.logout = async (req, res) => {
    res.clearCookie("tokenUser");
    res.redirect("/");
}

module.exports.forgotPassword = async (req, res) => {
    res.render("client/pages/user/forgotPassword", 
        { pageTitle: "Trang quên mật khẩu"}
    );
}

module.exports.forgotPasswordPost = async (req, res) => {
    const email = req.body.email;
    const user = await User.findOne({
        email: email,
        deleted: false,
    });

    if (!user) {
        req.flash("error", "Email không tồn tại!");
        backURL=req.header('Referer') || '/'
        res.redirect(backURL);
    }

    const OTP = {
        email: email,
        otp: generate.RandomNumber(6),
        expireAt: Date.now(),
    }
    const newOTP = new ForgotPassword(OTP);
    await newOTP.save();

    // Nếu tồn tại email thì gửi mã OTP qua email
    
    const subject = "Mã OTP xác minh để đổi mật khẩu!";
    const html = `Mã OTP để lấy lại mật khẩu là <b>${OTP.otp}</b>. Mã sẽ hết hạn sau 3 phút`;
    sendMailHelper.sendMail(email, subject, html);
    res.redirect(`/user/password/otp?email=${email}`);
}

module.exports.confirm = async (req, res) => {
    const email = req.query.email;
    res.render("client/pages/user/otpConfirm", 
        { pageTitle: "Xác thực OTP",
            email: email,
        }
    );

}

module.exports.confirmPost = async (req, res) => {
    const email = req.body.email
    const isOTP = await ForgotPassword.findOne({
        email: email,
        otp: req.body.otp,
    });
    if (!isOTP) {
        req.flash("error", "Mã OTP không hợp lệ");
        backURL=req.header('Referer') || '/'
        res.redirect(backURL);
        return;
    }
    const user = await User.findOne({
        email: email,
    });


    res.cookie("tokenUser", user.tokenUser);
    res.redirect("/user/password/reset");
}

module.exports.resetPassword = async (req, res) => {
    res.render("client/pages/user/resetPassword", {
        pageTitle: "Đổi mật khẩu",
    });
}

module.exports.resetPasswordPost = async (req, res) => {
    const password = req.body.password;
    sendMail.send()
    if (req.body.confirm != password) {
        req.flash("error", "Mật khẩu xác nhận không trùng");
        backURL=req.header('Referer') || '/'
        res.redirect(backURL);
        return;
    }
    await User.updateOne({tokenUser: req.cookies.tokenUser}, {password: md5(password)});
    res.redirect("/");
}

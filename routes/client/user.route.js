const express = require("express");
const router = express.Router();
const validate = require('../../validates/client/register.validate');
controller = require("../../controllers/client/user.controller");

router.get("/register", controller.register);

router.post("/register", validate.Register, controller.registerPost);

router.get("/login", controller.login);

router.post("/login", controller.loginPost);

router.get("/logout", controller.logout);

router.get("/password/forgot", controller.forgotPassword);

router.post("/password/forgot", controller.forgotPasswordPost);

router.get("/password/otp", controller.confirm);

router.post("/password/otp", controller.confirmPost);

router.get("/password/reset", controller.resetPassword);

router.post("/password/reset", controller.resetPasswordPost);
module.exports = router;
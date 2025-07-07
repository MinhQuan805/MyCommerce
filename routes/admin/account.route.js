const express = require("express");
const multer = require('multer');
const storageMulter = require('../../helpers/storageMulter');
const validate = require('../../validates/admin/account.validate');
const router = express.Router();

const uploadCloud = require('../../middleware/admin/uploadCloud.middleware');
const upload = multer();

const controller = require("../../controllers/admin/account.controller");

router.get("/", controller.index);

router.get("/create", controller.create);

router.post("/create",
    upload.single('avatar'),
    uploadCloud.upload,
    validate.Account,
    controller.createPost);

router.get("/edit/:id", controller.edit);

router.patch("/edit/:id",
    upload.single('avatar'),
    uploadCloud.upload,
    controller.editPost);

router.patch("/change-status/:status/:id", controller.changeStatus);

router.delete("/form-delete/:id", controller.deleteItem);

module.exports = router;

const express = require("express");
const multer = require('multer'); // Upload ảnh vào
const storageMulter = require('../../helpers/storageMulter');
const validate = require('../../validates/admin/product.validate');
const router = express.Router();

const uploadCloud = require('../../middleware/admin/uploadCloud.middleware');
const upload = multer();

const controller = require("../../controllers/admin/product.controller");

router.get("/", controller.index);

router.patch("/change-status/:status/:id", controller.changeStatus);

router.patch("/change-multi", controller.changeMulti);

router.delete("/form-delete/:id", controller.deleteItem);

router.get("/create", controller.create);

router.post("/create",
	upload.single('thumbnail'), // Truyền ảnh vào bằng req.file
	uploadCloud.upload,
	validate.createPost,
	controller.createPost
);


router.get("/edit/:id", controller.edit);

router.patch("/edit/:id", 
	upload.single('thumbnail'),
	uploadCloud.upload,
	validate.createPost,
	controller.editPost
);

router.get("/detail/:id", controller.detail);

module.exports = router;
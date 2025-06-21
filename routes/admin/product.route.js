const express = require("express");
const multer = require('multer'); // Upload ảnh vào
const storageMulter = require('../../helpers/storageMulter');
const validate = require('../../validates/admin/product.validate');
const upload = multer({ storage: storageMulter() });

const router = express.Router();

const controller = require("../../controllers/admin/product.controller");
router.get("/", controller.index);

router.patch("/change-status/:status/:id", controller.changeStatus);

router.patch("/change-multi", controller.changeMulti);

router.delete("/form-delete/:id", controller.deleteItem);

router.get("/create", controller.create);

router.post("/create",
        upload.single('thumbnail'), // Truyền ảnh vào bằng req.file
        validate.createProduct,
        controller.createProduct);

router.get("/edit/:id", controller.edit);

router.patch("/edit/:id", 
        upload.single('thumbnail'),
        validate.createProduct,
        controller.editProduct);
module.exports = router;
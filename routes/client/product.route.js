const express = require("express");
const router = express.Router();
controller = require("../../controllers/client/product.controller")

router.get("/", controller.index);

router.get("/detail/:slugProduct", controller.detail);

router.get("/:slugCategory", controller.category);

module.exports = router;
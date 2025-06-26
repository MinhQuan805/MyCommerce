const express = require("express");
const router = express.Router();
controller = require("../../controllers/client/product.controller")
router.get("/", controller.index);

router.get("/:slug", controller.detail);

module.exports = router;
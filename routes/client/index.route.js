const productRouter = require("./product.route");
const homeRouter = require("./home.route");
const userRouter = require("./user.route");
const categoryMiddleware = require("../../middleware/client/category.middleware");
const userMiddleware = require("../../middleware/client/user.middleware");
module.exports = (app) => {
    app.use(userMiddleware.infoUser)
    app.use(categoryMiddleware.category)
    app.use("/", homeRouter);
    app.use("/products", productRouter);
    app.use("/user", userRouter);
}
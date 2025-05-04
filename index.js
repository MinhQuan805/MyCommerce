const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT;

const routeAdmin = require("./routes/admin/index.route");
const route = require("./routes/client/index.route");

app.set("views", "./views");
app.set("view engine", "pug");

app.use(express.static("public"));
//Route
route(app);
routeAdmin(app);
const connect = require("./config/database");
connect();
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
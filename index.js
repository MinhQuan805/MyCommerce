const express = require("express");
const app = express();
var methodOverride = require('method-override');
const bodyParser = require('body-parser');
require("dotenv").config();
const port = process.env.PORT;

const routeAdmin = require("./routes/admin/index.route");
const route = require("./routes/client/index.route");

const systemConfig = require("./config/system");

app.set("views", "./views");
app.set("view engine", "pug");

app.use(express.static("public"));

app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: false }));

// App Locals Variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;


//Routes
route(app);
routeAdmin(app);

const connect = require("./config/database");
connect();

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
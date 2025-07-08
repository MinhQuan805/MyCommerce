const express = require("express");
const app = express();
var methodOverride = require('method-override');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const moment = require('moment');
var flash = require('express-flash');
var path = require('path');
require("dotenv").config();
const port = process.env.PORT;

const routeAdmin = require("./routes/admin/index.route");
const route = require("./routes/client/index.route");

const systemConfig = require("./config/system");

app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

app.use(express.static(`${__dirname}/public`));

// Method Override
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: false }));
// End method-override

// App Locals Variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment;

// Flash
app.use(cookieParser('MyCommerce'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());
// End Flash

// TinyMCE
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

// End TinyMCE


//Routes
route(app);
routeAdmin(app);
// End Routes

//Connect
const connect = require("./config/database");
connect();

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
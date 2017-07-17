const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const mustacheExpress = require('mustache-express');
const expressValidator = require('express-validator');
var moment = require('moment');
moment().format();
const models = require('./models');
const dashboard = require('./routes/dashboard');
const index = require('./routes/index');
const login = require('./routes/login');
const logout = require('./routes/logout');
const gabs = require('./routes/gabs');
const signup = require('./routes/signup');

const application = express();

application.engine('mustache', mustacheExpress());
application.set('views', './views');
application.set('view engine', 'mustache');

application.use(cookieParser());
application.use(bodyParser());
application.use(expressValidator());

application.use(session ({
    secret: 'secret123',
    resave: false,
    saveUninitialized: false
}));

application.use(express.static(__dirname + '/public'));

application.use(dashboard);
application.use(index);
application.use(login);
application.use(logout);
application.use(gabs);
application.use(signup);

application.listen(3000);
const express = require('express');
const router = express.Router();
const models = require('../models');
const expressValidator = require('express-validator');

router.use(expressValidator({
    customValidators: {
        isEqual: function(str1, str2) {
            return str1 === str2;
        }
    }
}));

router.get('/signup', (request, response) => {
    response.render('signup');
});

router.post('/signup', async(request, response) => {
    var username = request.body.username;
    var email = request.body.email;
    var pwd = request.body.password;
    var confPwd = request.body.confPassword;

    request.checkBody('username', 'No User Name was provided.').notEmpty();
    request.checkBody('username', 'User Name must be less than 100 characters. ').matches(/^.{0,100}$/,"i");
    request.checkBody('email', 'No Email was provided.').notEmpty();
    request.checkBody('email', 'Please provide a valid email address.').matches(/.+\@.+\..+/, "i");
    request.checkBody('password', 'All fields must be entered').notEmpty();
    request.checkBody('password', 'Password must be more than 8 characters, contain one uppercase letter and contain no special characters.').matches(/^(?=.*[a-z])(?=.*[A-Z]).{8,}$/, "i");
    request.checkBody('confPassword', 'All field must be entered').notEmpty();
    request.checkBody('confPassword', 'Passwords do not match.').isEqual(pwd, confPwd);

    var errors = request.validationErrors();
    var query = { where: { email: email } };
    var user = await models.user.find(query);
    var model = { errors: errors };

    if (model.errors) {
        response.render('signup', model);
    } else if (user){
        var model = { unavailable: 'That email is already registered.'};
        response.render('signup', model);
    }
     else {
        var newUser = await models.users.create({ username: username, email: email, password: pwd });
        request.session.isAutheniticated = true;
        request.session.username = newUser.username;
        request.session.userId = newUser.id;
        response.redirect('/dashboard');
    }
});

module.exports = router;
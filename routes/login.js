const express = require('express');
const router = express.Router();
const models = require('../models');

router.get('/login', (request, response) => {
    response.render('login');
});

router.post('/login', async (request, response) => {
    var username = request.body.username;
    var password = request.body.password;
    var query = { where: { username: username, password: password } };
    var user = await models.users.find(query);

    if (user) {
        request.session.isAuthenticated = true;
        request.session.username = user.username;
        request.session.userId = user.id;
        response.redirect('/dashboard');
    } else {
        response.redirect('/signup');
    }
});

module.exports = router;
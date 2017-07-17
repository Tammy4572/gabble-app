const express = require('express');
const router = express.Router();
const models = require('../models');

router.get('/', (request, response) => {
    if (request.session.isAuthenticated) {
        response.redirect('/dashboard');
    } else {
        response.render('index');
    }
});

module.exports = router;
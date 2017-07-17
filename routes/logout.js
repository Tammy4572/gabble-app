const express = require('express');
const router = express.Router();
const models = require('../models');

router.post('/logout', (request, response) => {
    request.session.destroy();
    response.redirect('/');
});

module.exports = router;
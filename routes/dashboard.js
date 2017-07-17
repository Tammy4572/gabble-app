const express = require('express');
const router = express.Router();
const models = require('../models');

router.get('/dashboard', async (request, response) => {
    if (!request.session.isAuthenticated) {
        response.redirect('/login');
    } else {
        var gabs = await models.gabs.all({
            order: [['createdAt', 'DESC']],
            include: [models.users, models.likes]
        });
        var model = { gabs: gabs, username: request.session.username };
        response.render('dashboard', model);
    }
});

router.post('/like/:id', async (request, response) => {
    var gabId = request.params.id;
    var userId = request.session.userId;
    var likes = await models.likes.find({ where: { gabId: gabId, userId: userId } });
    if (!likes) {
        var newLike = await models.likes.create({ gabId: gabId, userId: userId });
    }
    response.redirect('/dashboard');
});

router.get('/likes/:id', async (request, response) => {
    if (!request.session.isAuthenticated) {
        response.redirect('/login');
    } else {
        var gabId = request.params.id;
        var gab = await models.gabs.find({ where: { id: gabId } });
        var likes = await models.likes.findAll({ where: { gabId: gabId }, include: [models.users] });
        var model = { gab: gab, likes: likes, username: request.session.username };
        response.render('likes', model);
    }
});

module.exports = router;
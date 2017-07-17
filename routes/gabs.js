const express = require('express');
const router = express.Router();
const models = require('../models');
var moment = require('moment');
moment().format();

router.get('/creategab', (request, response) => {
    if (!request.session.isAuthenticated) {
        response.redirect('/login');
    } else {
        response.render('creategab', request.session);
    }
});

router.get('/usergabs', async (request, response) => {
    if (!request.session.isAuthenticated) {
        response.redirect('/login');
    } else {
        var userGabs = await models.gabs.findAll({
            order: [['createdAt', 'DESC']],
            where: { userId: request.session.userId },
            include: [ models.users, models.likes ]
        });
        model = { gabs: userGabs, username: request.session.username };
        response.render('usergabs', model);
    }
});

router.get('/editgab', (request, response) => {
    if (!request.session.isAuthenticated) {
        response.redirect('/login');
    } else {
        var gabId = { gabId: request.params.id, username: request.session.username };
        response.render('editgab', gabId);
    }
});

router.post('/edit/:id', async (request, response) => {
    var gabId = request.params.id;
    var newContent = request.body.newContent;
    request.checkBody('newContent', 'Content field cannot be empty. ').notEmpty();
    var errors = request.validationErrors();
    var model = { errors: errors };
    if (model.errors) {
        response.render('editgab', model);
    } else {
        var editGab = await models.gabs.update({
            content: newContent
        }, {
            where: {
                id: gabId
            }
        });
        response.redirect('/usergabs');
    }
});

router.post('/gabs', async (request, response) => {
    var gab = request.body.gab;
    request.checkBody('gab', 'Message must be less than 140 characters but cannot be empty.').len(1,140);
    var errors = request.validationErrors();
    var model = { errors: errors };
    var timestamp = moment().format('dddd, MMM Do YYY, h:mm a');
    if (model.errors) {
        response.render('creategab', model);
    } else {
        var newGab = await models.gabs.create({ content: gab, contributor: request.session.username, userId: request.session.userId, timestamp: timestamp });
        response.redirect('/dashboard');
    }
});

router.post('/usergabs/like/:id', async (request, response) => {
    var gabId = request.params.id;
    var userId = request.session.userId;
    var likes = await models.likes.find({ where: { gabId: gabId, userId: userId } });

    if (!likes) {
        var newLike = await models.likes.create({ gabId: gabId, userId: userId });
    }
    response.redirect('/mygabs');
});

router.post('/delete/:id', async (request, response) => {
    var gabId = request.params.id;
    var deleteLikes = await models.likes.destroy({
        where: {
            gabId: gabId
        }
    });
    var deleteGab = await models.gabs.destroy({
        where: {
            id: gabId
        }
    });
    response.redirect('/usergabs');
});

module.exports = router;
"use strict";
const express = require('express');
const ResponseFactory = require('./response/response-factory');
const RouterFactory = require('./router-factory');

const createRouter = function() {
    const router = express.Router();

    router.use('/auth', RouterFactory.Auth.create());
    router.use('/users', RouterFactory.User.create());

    // Catch-all 404 for unhandled routes
    router.all('*', (req, res) => {
       ResponseFactory.notFound(res);
    });

    return router;
};

module.exports.create = createRouter;
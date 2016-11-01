"use strict";
const express = require('express');
const AuthRoutes = require('./routes/auth-routes');
const authMiddleware = require('./middleware/auth');

const createRouter = function() {
    const router = express.Router();

    AuthRoutes.setPublicRoutes(router);

    router.use(authMiddleware);

    AuthRoutes.setPrivateRoutes(router);

    return router;
};

module.exports.create = createRouter;
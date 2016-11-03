"use strict";
const express = require('express');
const routes = require('./routes');
const authMiddleware = require('./middleware/auth');

const createRouter = function() {
    const router = express.Router();

    routes.Auth.setPublicRoutes(router);
    routes.User.setPublicRoutes(router);
    routes.TimeBlock.setPublicRoutes(router);

    // Require authentication for protected routes
    router.use(authMiddleware);

    routes.Auth.setProtectedRoutes(router);
    routes.User.setProtectedRoutes(router);
    routes.TimeBlock.setProtectedRoutes(router);

    return router;
};

module.exports.create = createRouter;
"use strict";
const BaseRoutes = require('./base-routes');

class TimeBlockRoutes extends BaseRoutes {
    /**
     * Set public routes that do not require authentication
     * @param {express.Router} router
     * @returns {express.Router}
     */
    static setPublicRoutes(router) {
        // No public routes
        return router;
    }

    /**
     * Set protected routes that require authentication
     * @param {express.Router} router
     * @returns {express.Router}
     */
    static setProtectedRoutes(router) {
        return router;
    }
}

module.exports = TimeBlockRoutes;
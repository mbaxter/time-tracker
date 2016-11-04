"use strict";
const BaseModelRoutes = require('./base-model-routes');
const collection = require('../../db/collection');

class TimeBlockRoutes extends BaseModelRoutes {
    static get collection() {
        return collection.TimeBlock;
    }

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
        // Post a single record
        router.post("/time-blocks", this.getInsertRecordHandler(true));

        return router;
    }
}

module.exports = TimeBlockRoutes;
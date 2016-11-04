"use strict";

const BaseModelRoutes = require('./base-model-routes');
const collection = require('../../db/collection');

class UserRoutes extends BaseModelRoutes {
    static get collection() {
        return collection.User;
    }

    /**
     * Set public routes that do not require authentication
     * @param {express.Router} router
     * @returns {express.Router}
     */
    static setPublicRoutes(router) {
        // Post a single user
        router.post("/users", this.getInsertRecordHandler(false));
    }
}

module.exports = UserRoutes;
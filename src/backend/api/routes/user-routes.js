"use strict";

const BaseModelRoutes = require('./base-model-routes');
const collection = require('../../db/collection');
const QueryOptionsBuilder = require('../../db/query/query-options-builder');

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

        return router;
    }

    /**
     * Set protected routes that require authentication
     * @param {express.Router} router
     * @returns {express.Router}
     */
    static setProtectedRoutes(router) {
        // Get current user
        router.get("/users/me", (req, res) => {
            const id = req.jwt.userId;

            // Exclude password field
            let options = QueryOptionsBuilder.create().excludeFields('password');
            let standardHandler = this.getRetrieveByIdHandler(id, options);
            standardHandler(req, res);
        });

        // Update user record
        router.patch("/users/:userId", (req, res) => {
            const id = req.params.userId;

            let standardHandler = this.getUpdateByIdHandler(id);
            standardHandler(req, res);
        });

        return router;
    }
}

module.exports = UserRoutes;
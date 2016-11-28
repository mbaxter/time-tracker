"use strict";

const BaseModelRoutes = require('./base-model-routes');
const collection = require('../../db/collection');
const QueryOptionsBuilder = require('../../db/query/query-options-builder');
const omit = require('lodash/omit');

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
        router.post("/users", this.getInsertRecordHandler(false, (record) => omit(record.toJSON(), 'password')));

        return router;
    }

    /**
     * Set protected routes that require authentication
     * @param {express.Router} router
     * @returns {express.Router}
     */
    static setProtectedRoutes(router) {
        // Get all users
        router.get("/users", (req, res) => {
            const queryOptions = QueryOptionsBuilder.create()
                .orderBy('id', 'ASC')
                .excludeFields('password');
            const limit = req.query.limit;
            const offset = req.query.offset;

            const handler = this.getRetrieveCollectionHandler(limit, offset, queryOptions);
            handler(req, res);
        });

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

            let standardHandler = this.getUpdateByIdHandler(id, (record) => omit(record.toJSON(), 'password'));
            standardHandler(req, res);
        });

        // Delete user record
        router.delete("/users/:userId", (req, res) => {
            const id = req.params.userId;

            let standardHandler = this.getDeleteByIdHandler(id);
            standardHandler(req, res);
        });

        return router;
    }
}

module.exports = UserRoutes;
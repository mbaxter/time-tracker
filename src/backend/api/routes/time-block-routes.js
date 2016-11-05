"use strict";
const BaseModelRoutes = require('./base-model-routes');
const collection = require('../../db/collection');
const QueryOptionsBuilder = require('../../db/query/query-options-builder');

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

        // Get user's timeBlocks
        router.get("/users/:userId/time-blocks", (req, res) => {
            const queryOptions = QueryOptionsBuilder.create()
                .orderBy('start', 'DESC');
            const limit = req.query.limit;
            const offset = req.query.offset;

            const handler = this.getRetrieveUserCollectionHandler(req.params.userId, limit, offset, queryOptions);
            handler(req, res);
        });

        return router;
    }
}

module.exports = TimeBlockRoutes;
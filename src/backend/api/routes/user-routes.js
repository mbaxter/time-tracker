"use strict";

const BaseRoutes = require('./base-routes');
const ModelResponseFactory = require('../response/model-response-factory');
const collection = require('../../db/collection');
const isArray = require('lodash/isArray');
const ValidationError = require('../../db/collection/error/validation-error');

class UserRoutes extends BaseRoutes {
    /**
     * Set public routes that do not require authentication
     * @param {express.Router} router
     * @returns {express.Router}
     */
    static setPublicRoutes(router) {
        // Post a single user
        router.post("/users", (req, res) => {
            const user = req.body;
            if (!user || isArray(user)) {
                // Must supply one user object
                // Batch upsert (array of users) is not supported
                return ModelResponseFactory.badRequest(res, {
                    error: "Must supply a single user."
                });
            }

            collection.User.create(user).then((user) => {
                return ModelResponseFactory.insertSuccess(res, user);
            }).catch((err) => {
                if (err instanceof ValidationError) {
                   return ModelResponseFactory.validationError(res, err);
                } else if(err.name == 'SequelizeUniqueConstraintError') {
                    return ModelResponseFactory.duplicateConflict(res);
                }
                ModelResponseFactory.internalError(err);
            });
        });
    }
}

module.exports = UserRoutes;
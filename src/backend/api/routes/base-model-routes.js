"use strict";
const BaseRoutes = require('./base-routes');
const NotImplementedError = require('../../error/method-not-implemented-error');
const ModelResponseFactory = require('../response/model-response-factory');
const isArray = require('lodash/isArray');
const ValidationError = require('../../db/collection/error/validation-error');

class BaseModelRoutes extends BaseRoutes {
    static get collection() {
        throw NotImplementedError.create(`${this.name}.collection getter`);
    }

    static userIdMatchesCurrentUser(req, userId) {
        return req.jwt && req.jwt.userId == userId;
    }

    static recordBelongsToCurrentUser(req, record, userField = 'user_id') {
        const recordUserId = record ? record[userField] : null;
        return recordUserId && this.userIdMatchesCurrentUser(req, recordUserId);
    }

    static getRetrieveByIdHandler(id, queryOptions) {
        const collection = this.collection;
        return (req, res) => {
            collection.retrieveOneById(id, queryOptions)
                .then((record) => {
                    if (!record) {
                        return ModelResponseFactory.notFound(res);
                    }
                    ModelResponseFactory.returnRecord(res, record);
                });
        };
    }

    /**
     * Returns a request handler that expects the body of the request to be a single json object representing a
     * single new record to be inserted.
     * @returns {function}
     */
    static getInsertRecordHandler(checkOwnership = true) {
        const collection = this.collection;
        return (req, res) => {
            const record = req.body;
            if (!record || isArray(record)) {
                // Must supply one user object
                // Batch upsert (array of users) is not supported
                return ModelResponseFactory.badRequest(res, {
                    error: "Must supply a single record."
                });
            }

            if (checkOwnership && !this.recordBelongsToCurrentUser(req, record)) {
                // Attempt to update other users records is forbidden
                return ModelResponseFactory.forbidden(res, {
                    error: "Attempt to insert record that is not owned by current user."
                });
            }

            collection.create(record).then((record) => {
                return ModelResponseFactory.insertSuccess(res, record);
            }).catch((err) => {
                if (err instanceof ValidationError) {
                    return ModelResponseFactory.validationError(res, err);
                } else if(err.name == 'SequelizeUniqueConstraintError') {
                    return ModelResponseFactory.duplicateConflict(res);
                }
                ModelResponseFactory.internalError(err);
            });
        };
    }
}

module.exports = BaseModelRoutes;
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

    /**
     * Returns a request handler that expects the body of the request to be a single json object representing a
     * single new record to be inserted.
     * @returns {function}
     */
    static getInsertRecordHandler() {
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
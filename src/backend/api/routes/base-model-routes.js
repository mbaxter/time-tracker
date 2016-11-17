"use strict";
const BaseRoutes = require('./base-routes');
const NotImplementedError = require('../../error/method-not-implemented-error');
const ModelResponseFactory = require('../response/model-response-factory');
const ValidationError = require('../../db/collection/error/validation-error');
const QueryOptionsBuilder = require('../../db/query/query-options-builder');
const Permissions = require('../../../shared/permissions');
const Tables = require('../../../shared/constants/tables');
const isPlainObject = require('lodash/isPlainObject');
const isEmpty = require('lodash/isEmpty');

class BaseModelRoutes extends BaseRoutes {
    static get collection() {
        throw NotImplementedError.create(`${this.name}.collection getter`);
    }

    static userIdMatchesCurrentUser(req, userId) {
        return req.jwt && req.jwt.userId == userId;
    }

    static recordBelongsToCurrentUser(req, record) {
        const userField = this.collection.name == Tables.User ? 'id' : 'user_id';
        const recordUserId = record ? record[userField] : null;
        return recordUserId && this.userIdMatchesCurrentUser(req, recordUserId);
    }

    static getRetrieveByIdHandler(id, queryOptions) {
        const collection = this.collection;
        return (req, res) => {
            collection.retrieveOneById(id, queryOptions)
                .then((record) => {
                    if (!record || (!Permissions.canReadOtherUsersRecords(req.jwt.role, collection.name) &&
                        !this.recordBelongsToCurrentUser(req, record))) {
                        return ModelResponseFactory.notFound(res);
                    }

                    ModelResponseFactory.returnRecord(res, record);
                })
                .catch(this.getModelCRUDErrorHandler(res));
        };
    }

    static getRetrieveUserCollectionHandler(userId, limit, offset, queryOptions) {
        queryOptions = queryOptions || QueryOptionsBuilder.create();
        queryOptions = queryOptions.where('user_id', userId);

        const collection = this.collection;

        return (req, res) => {
            if(req.jwt.userId != userId && !Permissions.canReadOtherUsersRecords(req.jwt.role, collection.table)) {
                return ModelResponseFactory.forbidden(res, {
                    error: "Attempt to query for records that are not owned by current user."
                });
            }

            collection.retrieveAll(queryOptions, limit, offset)
                .then((records) => {
                    ModelResponseFactory.returnRecordSet(res, records);
                })
                .catch(this.getModelCRUDErrorHandler(res));
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
            if (!isPlainObject(record) || isEmpty(record)) {
                // Must supply one user object
                return ModelResponseFactory.badRequest(res, {
                    error: "Must supply a single record."
                });
            }

            if (checkOwnership && !Permissions.canCreateOtherUsersRecords(req.jwt.role, collection.name) &&
                !this.recordBelongsToCurrentUser(req, record)) {
                // Attempt to update other users records is forbidden
                return ModelResponseFactory.forbidden(res, {
                    error: "Attempt to insert record that is not owned by current user."
                });
            }

            collection.createRecord(record)
                .then((record) => {
                    return ModelResponseFactory.insertSuccess(res, record);
                })
                .catch(this.getModelCRUDErrorHandler(res));
        };
    }

    static getUpdateByIdHandler(id) {
        const collection = this.collection;

        return (req, res) => {
            this.collection.retrieveOneById(id)
                .then((record) => {
                    const fields = req.body;

                    if (!isPlainObject(fields) || isEmpty(fields)) {
                        return ModelResponseFactory.badRequest(res);
                    }
                    // Don't allow id or user id to be modified
                    if ((fields.id && fields.id != id ) || fields.user_id && fields.user_id != record.user_id) {
                        return ModelResponseFactory.badRequest(res);
                    }

                    if (record && !Permissions.canUpdateOtherUsersRecords(req.jwt.role, collection.name) &&
                        !this.recordBelongsToCurrentUser(req, record)) {
                        // Attempt to update other users records is forbidden
                        return ModelResponseFactory.forbidden(res, {
                            error: "Attempt to update record that is not owned by current user."
                        });
                    }

                    if (!record) {
                        return ModelResponseFactory.notFound(res);
                    }

                    return collection.updateRecord(record, fields)
                        .then((record) => {
                            ModelResponseFactory.returnRecord(res, record);
                        });
                })
                .catch(this.getModelCRUDErrorHandler(res));
        };
    }

    static getDeleteByIdHandler(id) {
        const collection = this.collection;

        return (req, res) => {
            this.collection.retrieveOneById(id)
                .then((record) => {
                    if (record && !Permissions.canDeleteOtherUsersRecords(req.jwt.role, collection.name) &&
                        !this.recordBelongsToCurrentUser(req, record)) {
                        // Attempt to update other users records is forbidden
                        return ModelResponseFactory.forbidden(res, {
                            error: "Attempt to delete record that is not owned by current user."
                        });
                    }

                    if (!record) {
                        return ModelResponseFactory.notFound(res);
                    }

                    return collection.deleteRecord(record)
                        .then(() => {
                            ModelResponseFactory.ok(res);
                        });
                })
                .catch(this.getModelCRUDErrorHandler(res));
        };
    }

    static getModelCRUDErrorHandler(res) {
        return (err) => {
            if (err instanceof ValidationError) {
                return ModelResponseFactory.validationError(res, err);
            } else if(err.name == 'SequelizeUniqueConstraintError') {
                return ModelResponseFactory.duplicateConflict(res);
            }
            console.log(err);
            ModelResponseFactory.internalError(res, err);
        };
    }
}

module.exports = BaseModelRoutes;
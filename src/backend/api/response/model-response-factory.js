"use strict";

const ResponseFactory = require('./response-factory');
const clone = require('lodash/clone');
const httpCodes = require('http-status-codes');

const ModelResponseFactory = clone(ResponseFactory);

ModelResponseFactory.validationError = function(res, validationError) {
    return res.status(httpCodes.BAD_REQUEST).json({
        error: validationError.message,
        validationErrors: validationError.toJSON()
    });
};

ModelResponseFactory.insertSuccess = function(res, record) {
    return res.status(httpCodes.CREATED).json({
        record: record
    });
};

ModelResponseFactory.duplicateConflict = function(res) {
    return res.status(httpCodes.CONFLICT).json({
        error: "Unable to fulfill request due to conflict with existing record."
    });
};

ModelResponseFactory.returnRecord = function(res, record) {
    return res.status(httpCodes.OK).json({
        record: record
    });
};

ModelResponseFactory.returnRecordSet = function(res, records) {
    return res.status(httpCodes.OK).json({
        records: records
    });
};

module.exports = ModelResponseFactory;
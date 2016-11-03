"use strict";

const ResponseFactory = require('./response-factory');
const clone = require('lodash/clone');
const httpCodes = require('http-status-codes');

const ModelResponseFactory = clone(ResponseFactory);

ModelResponseFactory.validationError = function(res, validationError) {
    return res.status(httpCodes.BAD_REQUEST).json({
        error: validationError.message,
        validationResults: validationError.toJSON()
    });
};

ModelResponseFactory.insertSuccess = function(res, record) {
    return res.status(httpCodes.CREATED).json({
        record: record
    });
};

ModelResponseFactory.duplicateConflict = function(res) {
    return res.status(httpCodes.CONFLICT).json({
        error: "Duplicate record."
    });
};

module.exports = ModelResponseFactory;
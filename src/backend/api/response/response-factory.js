"use strict";
const httpCodes = require('http-status-codes');

const ResponseFactory = {};

ResponseFactory.internalError = function(res, err) {
    let errorMessage = "Internal Error.";
    if (err instanceof Error) {
        errorMessage = err.message;
    } else if (err instanceof String) {
        errorMessage = err;
    }

    return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({
        error: errorMessage
    });
};

ResponseFactory.notFound = function(res) {
    return res.status(httpCodes.NOT_FOUND).end();
};

ResponseFactory.notImplemented = function(res) {
    return res.status(httpCodes.NOT_IMPLEMENTED).end();
};

module.exports = ResponseFactory;
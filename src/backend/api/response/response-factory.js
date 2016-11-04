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

ResponseFactory.badRequest = function(res, data) {
    if (data) {
        return res.status(httpCodes.BAD_REQUEST).json(data);
    } else {
        return res.status(httpCodes.BAD_REQUEST).end();
    }
};

ResponseFactory.notImplemented = function(res) {
    return res.status(httpCodes.NOT_IMPLEMENTED).end();
};

ResponseFactory.forbidden = function(res, data) {
    if (data) {
        return res.status(httpCodes.FORBIDDEN).json(data);
    } else {
        return res.status(httpCodes.FORBIDDEN).end();
    }
};

module.exports = ResponseFactory;
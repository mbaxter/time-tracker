"use strict";
const httpCodes = require('http-status-codes');

const ResponseFactory = {};

ResponseFactory.internalError = function(res, err) {
    return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({
        error: err
    });
};

module.exports = ResponseFactory;
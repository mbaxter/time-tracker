"use strict";
const httpCodes = require('http-status-codes');

const FailedRequestError = function(httpStatusCode) {
   this.message = `${httpStatusCode}: ${httpCodes.getStatusText(httpStatusCode)}`;
};

FailedRequestError.create = function(records, results) {
    return new FailedRequestError(records, results);
};

FailedRequestError.prototype = Object.create(Error.prototype);
FailedRequestError.prototype.name = "FailedRequestError";
FailedRequestError.prototype.message = "";
FailedRequestError.prototype.constructor = FailedRequestError;

module.exports = FailedRequestError;
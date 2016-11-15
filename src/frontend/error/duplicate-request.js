"use strict";

const DuplicateRequestError = function() {
   this.message = "A similar request is already in progress.";
};

DuplicateRequestError.create = function(records, results) {
    return new DuplicateRequestError(records, results);
};

DuplicateRequestError.prototype = Object.create(Error.prototype);
DuplicateRequestError.prototype.name = "DuplicateRequestError";
DuplicateRequestError.prototype.message = "";
DuplicateRequestError.prototype.constructor = DuplicateRequestError;

module.exports = DuplicateRequestError;
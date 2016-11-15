"use strict";

const UnauthorizedError = function() {
   this.message = "Unauthorized";
};

UnauthorizedError.create = function(records, results) {
    return new UnauthorizedError(records, results);
};

UnauthorizedError.prototype = Object.create(Error.prototype);
UnauthorizedError.prototype.name = "UnauthorizedError";
UnauthorizedError.prototype.message = "";
UnauthorizedError.prototype.constructor = UnauthorizedError;

module.exports = UnauthorizedError;
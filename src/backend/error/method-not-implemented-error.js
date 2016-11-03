"use strict";

// See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#Custom_Error_Types
// for technique on extending Error class
const MethodNotImplementedError = function(methodName) {
    this.message = `Abstract method "${methodName}" not implemented`;
    this.stack = (new Error()).stack;
};

MethodNotImplementedError.create = function(methodName) {
    return new MethodNotImplementedError(methodName);
};

MethodNotImplementedError.prototype = Object.create(Error.prototype);
MethodNotImplementedError.prototype.name = "MethodNotImplementedError";
MethodNotImplementedError.prototype.message = "";
MethodNotImplementedError.prototype.constructor = MethodNotImplementedError;

module.exports = MethodNotImplementedError;
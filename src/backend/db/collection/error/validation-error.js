"use strict";

// See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#Custom_Error_Types
// for technique on extending Error class
const ValidationError = function(records, results) {
    this.message = "Validation failed.";
    this.stack = (new Error()).stack;
    this.validationResults = records.map((record, index) => {
        return {
            record: record,
            validationResponse: results[index]
        };
    });
};

ValidationError.create = function(records, results) {
    return new ValidationError(records, results);
};

ValidationError.prototype = Object.create(Error.prototype);
ValidationError.prototype.name = "ValidationError";
ValidationError.prototype.message = "";
ValidationError.prototype.constructor = ValidationError;

ValidationError.prototype.toJSON = function() {
    return this.validationResults;
};

ValidationError.prototype.toString = function() {
    let str = this.message + "\n";
    str += JSON.stringify(this.validationResults, null, 4) + "\n";
    return str;
};

module.exports = ValidationError;
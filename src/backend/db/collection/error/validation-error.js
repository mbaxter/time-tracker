"use strict";
const compact = require('lodash/compact');

// See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#Custom_Error_Types
// for technique on extending Error class
/**
 *
 * @param {Object[]} records
 * @param {ModelValidationResponse[]} results
 * @constructor
 */
const ValidationError = function(records, results) {
    this.message = "Validation failed.";
    this.stack = (new Error()).stack;
    this.errors = compact(results.map((result, index) => {
        if (result.isValid) {
            // falsey values will be removed by compact
            return false;
        }
        return {
            record: records[index],
            error: result.error,
            fieldErrors: result.fieldErrors
        };
    }));
};

ValidationError.create = function(records, results) {
    return new ValidationError(records, results);
};

ValidationError.prototype = Object.create(Error.prototype);
ValidationError.prototype.name = "ValidationError";
ValidationError.prototype.message = "";
ValidationError.prototype.constructor = ValidationError;

ValidationError.prototype.toJSON = function() {
    return this.errors;
};

ValidationError.prototype.toString = function() {
    let str = this.message + "\n";
    str += JSON.stringify(this.validationResults, null, 4) + "\n";
    return str;
};

module.exports = ValidationError;
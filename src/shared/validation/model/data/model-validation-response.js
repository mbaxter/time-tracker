"use strict";
const defaults = require('lodash/defaults');

class ModelValidationResponse {
   constructor() {
       this.isValid = true;
       this.fieldErrors = {};
       this.error = '';
   }

   static create() {
       return new this();
   }

    /**
     * @param {... ModelValidationResponse} responses
     */
   static merge(... responses) {
      const merged = this.create();
        responses.forEach((response) => {
            merged.isValid = merged.isValid && response.isValid;
            merged.error = merged.error || response.error;
            merged.fieldErrors = defaults(merged.fieldErrors, response.fieldErrors);
        });

        return merged;
   }

   toJSON() {
       return {
           isValid: this.isValid,
           error: this.error,
           fieldErrors: this.fieldErrors
       };
   }
}

module.exports = ModelValidationResponse;
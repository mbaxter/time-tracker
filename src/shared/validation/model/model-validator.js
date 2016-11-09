"use strict";
const ModelValidationResponse = require('./data/model-validation-response');
const isUndefined = require('lodash/isUndefined');
const keys = require('lodash/keys');
const each = require('lodash/each');
const humanize = require('humanize-string');
const lowerCase = require('lodash/lowerCase');

class ModelValidator {

    constructor(fieldConfig, modelConfig = []) {
        this._fieldConfig = fieldConfig;
        this._modelConfig = modelConfig;
    }

    static create(fieldConfig, modelConfig) {
        return new ModelValidator(fieldConfig, modelConfig);
    }

    /**
     *
     * @param model
     * @returns {Object}
     */
    validateCreate(model) {
        return this.validate(model, true);
    }

    /**
     *
     * @param model
     * @returns {Object}
     */
    validateUpdate(model) {
        return this.validate(model, false);
    }

    /**
     * Returns an object that contains any errors found and a boolean isValid field.
     * @param {object} model
     * @param {boolean} enforceRequiredFields - If true, missing required fields will generate an error
     * @returns {ModelValidationResponse}
     */
    validate(model, enforceRequiredFields) {
        const result = this._validateFields(model, enforceRequiredFields);
        const modelResult = this._validateModel(model);
        return ModelValidationResponse.merge(result, modelResult);
    }

    _validateFields(model, enforceRequired) {
        const result = ModelValidationResponse.create();

        each(this._fieldConfig, (config, fieldName) => {
            const fieldValue = model[fieldName];
            if (isUndefined(fieldValue) || fieldValue === '') {
                if (enforceRequired && config.required) {
                    result.isValid = false;
                    result.fieldErrors[fieldName] = `${humanize(fieldName)} is required.`;
                }
                return;
            }
            for (let constraint of config.constraints) {
                let isValid = this._evaluateValidators(fieldValue, constraint.validators);
                if (!isValid) {
                    result.isValid = false;
                    result.fieldErrors[fieldName] = constraint.message;
                    break;
                }
            }
        });

        if (!result.isValid) {
            result.error = `Please correct fields: ${keys(result.fieldErrors).map(lowerCase).join(', ')}`;
        }

        return result;
    }

    _validateModel(model) {
        const result = ModelValidationResponse.create();
        for (let constraint of this._modelConfig) {
            let isValid = this._evaluateValidators(model, constraint.validators);
            if (!isValid) {
                result.isValid = false;
                result.error = constraint.message;
            }
        }
        return result;
    }

    _evaluateValidators(value, validators) {
        return validators.reduce((accum, validator) => {
            return accum && validator(value);
        }, true);
    }
}

module.exports = ModelValidator;
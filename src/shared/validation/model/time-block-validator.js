"use strict";
const ModelValidator = require('./model-validator');
const fieldValidators = require('../field');
const isUndefined = require('lodash/isUndefined');

const fieldConfig = {
    user_id: {
        required: true,
        constraints: [
            {
                message: "Invalid user.",
                validators:[fieldValidators.Int.create()]
            }
        ]
    },
    start: {
        required: true,
        constraints: [
            {
                message: "Start field is invalid.",
                validators: [fieldValidators.Datetime.create()]
            }
        ]
    },
    end: {
        required: true,
        constraints: [
            {
                message: "End field is invalid.",
                validators: [fieldValidators.Datetime.create()]
            }
        ]
    }
};

const modelConfig = [
    {
        message: "Invalid date range.  Start must be earlier than end.",
        validators: [(model) => {
            if (isUndefined(model.start) || isUndefined(model.end)) {
                // Not enough information to validate
                return true;
            }

            return model.start < model.end;
        }]
    }
];

module.exports = ModelValidator.create(fieldConfig, modelConfig);
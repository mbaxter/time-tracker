"use strict";
const ModelValidator = require('./model-validator');
const fieldValidators = require('../field');
const UserRole = require('../../constants/user-role');

const fieldConfig = {
    email_address: {
        required: true,
        constraints: [
            {
                message: "A valid email address is required.",
                validators: [fieldValidators.Email.create()]
            }
        ]
    },
    password: {
        required: true,
        constraints: [
            {
                message: "Password must be at least 10 characters.",
                validators: [fieldValidators.MinStringLength.create(5)]
            }
        ]
    },
    role: {
        // The db has a default value of standard, so this isn't required
        required: false,
        constraints: [
            {
                message: "Invalid user role.",
                validators: [fieldValidators.Constant.create(UserRole)]
            }
        ]
    },
    timezone: {
        required: false,
        constraints: [
            {
                message: "Invalid timezone.",
                validators: [fieldValidators.Timezone.create()]
            }
        ]
    }
};

module.exports = ModelValidator.create(fieldConfig);
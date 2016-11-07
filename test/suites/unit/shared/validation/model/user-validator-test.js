"use strict";

const userValidator = require('../../../../../../src/shared/validation/model/user-validator');
const UserRole = require('../../../../../../src/shared/constants/user-role');

const ModelValidatorTester = require('./model-validator-tester');

const tester = new ModelValidatorTester({
    validator: userValidator,
    completeValidRecords: [{
        email_address: "test@test.com",
        password: "somePassword",
        role: UserRole.STANDARD,
        timezone: "UTC"
    }],
    requiredFields:['email_address', 'password'],
    invalidFields: {
        email_address: ['bla', '', false, true, 1, 'address@', '.com'],
        password: ['abc', true, false, ''],
        role: [9999, 'bla'],
        timezone: ['x', '', false]
    }
});

describe("UserValidator", () => {
    tester.runTests();
});
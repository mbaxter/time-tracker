"use strict";

const timeBlockValidator = require('../../../../../../src/shared/validation/model/time-block-validator');

const ModelValidatorTester = require('./model-validator-tester');

const tester = new ModelValidatorTester({
    validator: timeBlockValidator,
    completeValidRecords: [{
        user_id: 1,
        start: "2016-11-01T00:00:00+00:00",
        end: "2016-11-01T01:00:00+00:00"
    }],
    requiredFields:['user_id', 'start', 'end'],
    invalidFields: {
        user_id: ['bla', false, true],
        start: ['abc', true, false],
        end: ['abc', true, false]
    },
    invalidFieldsets: [
        {
            // End is before start
            start: "2016-11-01T10:00:00+00:00",
            end: "2016-11-01T09:00:00+00:00"
        },
        {
            // End == start
            start: "2016-11-01T10:00:00+00:00",
            end: "2016-11-01T10:00:00+00:00"
        }
    ]
});

describe("TimeBlockValildator", () => {
    tester.runTests();
});
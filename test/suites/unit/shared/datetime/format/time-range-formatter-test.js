"use strict";

const assert = require('assert');
const TimeRangeFormatter = require('../../../../../../src/shared/datetime/format/time-range-formatter');

describe("TimeRangeFormatter", () => {
    describe("getRangeInMinutes()", () => {
        const testCases = [
            {
                input: ["2016-01-01T00:00:00+00:00", "2016-01-01T01:00:00+00:00"],
                expected: 60
            },
            {
                input: ["2016-01-01T01:00:00+00:00", "2016-01-01T00:00:00+00:00"],
                expected: 60
            },
            {
                input: ["2016-01-01T00:00:00+02:00", "2016-01-01T00:00:00+00:00"],
                expected: 120
            },
            {
                input: ["2016-01-01T00:00:00+00:00", "2016-01-01T00:00:00+00:00"],
                expected: 0
            },
            {
                input: ["2016-01-01T00:15:00+00:00", "2016-01-01T00:02:00+00:00"],
                expected: 13
            }
        ];
        testCases.forEach((testCase) => {
            describe(`with input: ${JSON.stringify(testCase.input)}`, () => {
                 it(`should return ${testCase.expected}`, () => {
                     const actual = TimeRangeFormatter.getRangeInMinutes(... testCase.input);
                     assert.equal(actual, testCase.expected);
                 });
            });
        });
    });

    describe("getRangeInHoursAndMinutes()", () => {
        const testCases = [
            {
                input: ["2016-01-01T00:00:00+00:00", "2016-01-01T00:00:00+00:00"],
                expected: {
                    hours: 0,
                    minutes: 0
                }
            },
            {
                input: ["2016-01-01T00:20:00+00:00", "2016-01-01T00:00:00+00:00"],
                expected: {
                    hours: 0,
                    minutes: 20
                }
            },
            {
                input: ["2016-01-01T01:00:00+00:00", "2016-01-01T00:00:00+00:00"],
                expected: {
                    hours: 1,
                    minutes: 0
                }
            },
            {
                input: ["2016-01-01T02:00:00+00:00", "2016-01-01T00:15:00+00:00"],
                expected: {
                    hours: 1,
                    minutes: 45
                }
            }
        ];

        testCases.forEach((testCase) => {
            describe(`with input: ${JSON.stringify(testCase.input)}`, () => {
                it(`should return ${JSON.stringify(testCase.expected)}`, () => {
                    const actual = TimeRangeFormatter.getRangeInHoursAndMinutes(... testCase.input);
                    assert.deepEqual(actual, testCase.expected);
                });
            });
        });
    });

    describe("getRangeForDisplay()", () => {
        const testCases = [
            {
                input: ["2016-01-01T00:00:00+00:00", "2016-01-01T00:00:00+00:00"],
                expected: "0 min"
            },
            {
                input: ["2016-01-01T00:20:00+00:00", "2016-01-01T00:00:00+00:00"],
                expected: "20 min"
            },
            {
                input: ["2016-01-01T01:00:00+00:00", "2016-01-01T00:00:00+00:00"],
                expected: "1 hr"
            },
            {
                input: ["2016-01-01T02:00:00+00:00", "2016-01-01T00:15:00+00:00"],
                expected: "1 hr, 45 min"
            },
            {
                input: ["2016-01-01T03:00:00+00:00", "2016-01-01T00:15:00+00:00"],
                expected: "2 hr, 45 min"
            }
        ];

        testCases.forEach((testCase) => {
            describe(`with input: ${JSON.stringify(testCase.input)}`, () => {
                it(`should return ${JSON.stringify(testCase.expected)}`, () => {
                    const actual = TimeRangeFormatter.getRangeForDisplay(... testCase.input);
                    assert.deepEqual(actual, testCase.expected);
                });
            });
        });
    });
});
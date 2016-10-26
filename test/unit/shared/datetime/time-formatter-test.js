"use strict";

const assert = require('assert');
const TimeFormatter = require('../../../../src/shared/datetime/time-formatter');

describe("TimeFormatter", () => {
    describe("normalize()", function() {
        describe("with valid input", () => {
            const testCases = [
                {
                    expected: "15:32:58",
                    input: [
                        '15:32:58',
                        '03:32:58 pm',
                        '03:32:58 PM',
                        '3:32:58 pm',
                        '3:32:58 PM',
                    ]
                }, {
                    expected: "02:32:58",
                    input: [
                        '02:32:58',
                        '2:32:58',
                        '02:32:58 am',
                        '02:32:58 AM',
                        '2:32:58 am',
                        '2:32:58 AM',
                    ]
                },{
                    expected: "16:15:00",
                    input: [
                        '16:15',
                        '04:15 pm',
                        '04:15 PM',
                        '4:15 pm',
                        '4:15 PM'
                    ]
                }
            ];
            testCases.forEach((testCase) => {
                testCase.input.forEach((input) => {
                    describe(`of '${input}'`, () => {
                        it(`should correctly normalize the time to HH:mm:ss format: '${testCase.expected}'`, () => {
                            const actual = TimeFormatter.normalize(input);
                            assert.equal(actual, testCase.expected);
                        });
                    });
                });
            });
        });

        describe("with invalid input", () => {
            const testCases = ["bla", 3, false, null, undefined];
            testCases.forEach((testCase) => {
                describe(`of: ${JSON.stringify(testCase)}`, () => {
                    it("should return 'Invalid date'", () => {
                        const expected = "Invalid date";
                        const actual = TimeFormatter.normalize(testCase);
                        assert.equal(actual, expected);
                    });
                });
            });
        });
    });

    describe("formatForDisplay()", () => {
        describe("with valid input", () => {
            const testCases = [
                {
                    input: "15:33:59",
                    expected: "3:33 pm"
                },
                {
                    input: "01:23:45",
                    expected: "1:23 am"
                }
            ];

            testCases.forEach((testCase) => {
                describe(`of '${testCase.input}'`, () => {
                    it(`should return time in display format: '${testCase.expected}'`, () => {
                        assert.equal(TimeFormatter.formatForDisplay(testCase.input), testCase.expected);
                    });
                });
            });
        });

        describe("with invalid input", () => {
            const testCases = ["bla", 3, false, null, undefined];
            testCases.forEach((testCase) => {
                describe(`of: ${JSON.stringify(testCase)}`, () => {
                    it("should return 'Invalid date'", () => {
                        const expected = "Invalid date";
                        const actual = TimeFormatter.normalize(testCase);
                        assert.equal(actual, expected);
                    });
                });
            });
        });

    });

});
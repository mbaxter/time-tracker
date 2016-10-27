"use strict";

const assert = require('assert');
const DateFormatter = require('../../../../src/shared/datetime/date-formatter');

describe('DateFormatter', () => {
    describe('normalize()', () => {
        describe('with valid input', () => {
            const testCases = [
                {
                    expected: "2012-02-26",
                    input: [
                        "Feb 26, 2012",
                        "feb 26, 2012",
                        "Feb 26 2012",
                        "February 26, 2012",
                        "FEB 26, 2012",
                        "FEBRUARY 26 2012",
                        "Feb 26, 12",
                        "Feb 26 12",
                        "February 26, 12",
                        "FEB 26, 12",
                        "FEBRUARY 26 12",
                        "2012-02-26",
                        "2012-2-26",
                        "12-2-26",
                        "12-02-26",
                        "2012/02/26",
                        "2012/2/26",
                        "12/2/26",
                        "12/02/26",
                        "20120226",
                        "120226"
                    ]
                }
            ];

            testCases.forEach((testCase) => {
                testCase.input.forEach((input) => {
                    describe(`of '${input}'`, () => {
                        it(`should normalize to: ${testCase.expected}`, () => {
                            const actual = DateFormatter.normalize(input);
                            assert.equal(actual, testCase.expected);
                        });
                    });
                });
            });
        });
        describe('with invalid input', () => {
            const testCases = ['bla', 3, undefined, null, false, true,'201422', '2012022', '2012022'];
            testCases.forEach((testCase) => {
                describe(`of '${JSON.stringify(testCase)}'`, () => {
                    it("should return 'Invalid date'", () => {
                        const actual = DateFormatter.normalize(testCase);
                        assert.equal(actual, 'Invalid date');
                    });
                });
            });
        });
    });

    describe('formatForDisplay()', () => {
        describe('with default "includeYear" parameter', () => {
            it('should return expected displayed format without a year', () => {
                const actual = DateFormatter.formatForDisplay("2016-10-27");
                assert.equal(actual, "Thu, Oct 27");
            });
        });

        describe('with "includeYear" parameter set to true', () => {
            it('should return expected displayed format without a year', () => {
                const actual = DateFormatter.formatForDisplay("2016-10-27", true);
                assert.equal(actual, "Thu, Oct 27 2016");
            });
        });
    });
});

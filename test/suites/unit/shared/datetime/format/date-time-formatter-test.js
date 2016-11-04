"use strict";
const assert = require('assert');
const DateTimeFormatter = require('../../../../../../src/shared/datetime/format/date-time-formatter');

describe("DateTimeFormatter", () => {
    describe("normalize", () => {
        describe("with valid input", () => {
            const testCases = [
                {
                    expected: "2016-10-27T19:23:00+00:00",
                    input: ["Oct 27, 2016", "15:23", "US/Eastern"]
                }
            ];

            testCases.forEach((testCase) => {
                describe(`of ${JSON.stringify(testCase.input)}`, () => {
                    it("should return a normalized ISO string with UTC offset +00:00", () => {
                        const actual = DateTimeFormatter.normalize.apply(undefined, testCase.input);
                        assert.equal(actual, testCase.expected);
                    });
                });
            });
        });

        describe("with invalid input", () => {
            describe("for date", () => {
                const testCases = [
                    {
                        expected: "Invalid date",
                        input: ["2016-22-55", "15:23", "US/Eastern"]
                    }
                ];

                testCases.forEach((testCase) => {
                    describe(`of ${JSON.stringify(testCase.input[0])}`, () => {
                        it("should return 'Invalid date'", () => {
                            const actual = DateTimeFormatter.normalize.apply(undefined, testCase.input);
                            assert.equal(actual, 'Invalid date');
                        });
                    });
                });
            });
            describe("for time", () => {
                const testCases = [
                    {
                        expected: "Invalid date",
                        input: ["2016-12-02", "55:23", "US/Eastern"]
                    }
                ];

                testCases.forEach((testCase) => {
                    describe(`of ${JSON.stringify(testCase.input[1])}`, () => {
                        it("should return 'Invalid date'", () => {
                            const actual = DateTimeFormatter.normalize.apply(undefined, testCase.input);
                            assert.equal(actual, 'Invalid date');
                        });
                    });
                });
            });
            describe("for timezone", () => {
                const testCases = [
                    {
                        expected: "Invalid date",
                        input: ["2016-22-55", "15:23", "bla"]
                    }
                ];

                testCases.forEach((testCase) => {
                    describe(`of ${JSON.stringify(testCase.input[2])}`, () => {
                        it("should return 'Invalid date'", () => {
                            const actual = DateTimeFormatter.normalize.apply(undefined, testCase.input);
                            assert.equal(actual, 'Invalid date');
                        });
                    });
                });
            });
        });
    });

    describe("normalizeDate", () => {
        describe("with valid input", () => {
            const testCases = [
                {
                    expected: "1970-01-01T00:00:00+00:00",
                    input: [(new Date(0))]
                }
            ];

            testCases.forEach((testCase) => {
                describe(`of ${JSON.stringify(testCase.input)}`, () => {
                    it("should return a normalized ISO string with UTC offset +00:00", () => {
                        const actual = DateTimeFormatter.normalizeDate.apply(undefined, testCase.input);
                        assert.equal(actual, testCase.expected);
                    });
                });
            });
        });
    });

    describe("parseForDisplay", () => {
        describe("with valid input", () => {
            describe("and default 'includeYearForDate' parameter", () => {
                const testCases = [
                    {
                        input: ["2016-10-27T19:23:00+00:00", "US/Eastern"],
                        expected: {date: "Thu, Oct 27", time: "3:23 pm"}
                    }
                ];

                testCases.forEach((testCase) => {
                    describe(`of ${JSON.stringify(testCase.input)}`, () => {
                        it("should return a normalized ISO string with UTC offset +00:00", () => {
                            const actual = DateTimeFormatter.parseForDisplay.apply(undefined, testCase.input);
                            assert.deepEqual(actual, testCase.expected);
                        });
                    });
                });
            });

            describe("and 'includeYearForDate' parameter set to true", () => {
                const testCases = [
                    {
                        input: ["2016-10-27T19:23:00+00:00", "US/Eastern", true],
                        expected: {date: "Thu, Oct 27 2016", time: "3:23 pm"}
                    }
                ];

                testCases.forEach((testCase) => {
                    describe(`of ${JSON.stringify(testCase.input)}`, () => {
                        it("should return a normalized ISO string with UTC offset +00:00", () => {
                            const actual = DateTimeFormatter.parseForDisplay.apply(undefined, testCase.input);
                            assert.deepEqual(actual, testCase.expected);
                        });
                    });
                });
            });
        });

        describe("with invalid input", () => {
            describe("for the value parameter", () => {
                const testCases = [
                    {
                        input: ["2016-22-27T19:23:00+00:00", "US/Eastern"],
                        expected: {}
                    }
                ];

                testCases.forEach((testCase) => {
                    describe(`of ${JSON.stringify(testCase.input[0])}`, () => {
                        it("should return a response indicating failure", () => {
                            const actual = DateTimeFormatter.parseForDisplay.apply(undefined, testCase.input);
                            assert.deepEqual(actual, testCase.expected);
                        });
                    });
                });
            });

            describe("for the timezone parameter", () => {
                const testCases = [
                    {
                        input: ["2016-22-27T19:23:00+00:00", "bla"],
                        expected: {}
                    }
                ];

                testCases.forEach((testCase) => {
                    describe(`of ${JSON.stringify(testCase.input[1])}`, () => {
                        it("should return a response indicating failure", () => {
                            const actual = DateTimeFormatter.parseForDisplay.apply(undefined, testCase.input);
                            assert.deepEqual(actual, testCase.expected);
                        });
                    });
                });
            });
        });
    });
});

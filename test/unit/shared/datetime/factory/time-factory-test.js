"use strict";
const assert = require('assert');
const TimeFactory = require('../../../../../src/shared/datetime/factory/time-factory');
const uniq = require('lodash/uniq');

describe("TimeFactory", () => {
    describe("validate()", () => {
        describe("with valid input", () => {
            const testCases = [
                "00:00",
                "01:00",
                "00:30",
                "11:13",
                "12:00",
                "13:33",
                "23:59"
            ];
            testCases.forEach((testCase) => {
                describe(`of ${testCase}`, () => {
                    it("should return true", () => {
                        const actual = TimeFactory.validate(testCase);
                        assert.equal(actual, true);
                    });
                });
            });
        });
        describe("with invalid input", () => {
            const testCases = [
                "0:00",
                "1:00",
                "24:01",
                "-1:00",
                "12:99",
                "bla",
                false,
                undefined,
                true,
                "3",
                4
            ];
            testCases.forEach((testCase) => {
                describe(`of ${testCase}`, () => {
                    it("should return false", () => {
                        const actual = TimeFactory.validate(testCase);
                        assert.equal(actual, false);
                    });
                });
            });
        });
    });
    describe("fromHourRange()", () => {
        describe("with valid input", () => {
            describe("that yields many possible options", () => {
                const results = [];
                const numRuns = 100;
                const minHour = 12;
                const maxHour = 14;
                before(() => {
                    for (let i = 0; i < numRuns; i++) {
                        results.push(TimeFactory.fromHourRange(minHour, maxHour));
                    }
                });

                it("should produce results that validate", () => {
                    results.forEach((result) => {
                        assert.ok(TimeFactory.validate(result));
                    });
                });

                it("should produce results in the valid range", () => {
                    results.forEach((result) => {
                        const [hour, minute] = result.split(':');
                        assert.ok(hour >= minHour && hour <= maxHour, `Hour ${hour} should be in [${minHour}, ${maxHour}]`);
                        assert.ok(minute >= '00' && minute <= "59", `Minute ${minute} should be in [00, 59]`);
                        if (hour == maxHour) {
                            assert.equal(minute, '00', "At the extreme max hour, minutes should be 00");
                        }
                    });
                });

                it("should produce variable output", () => {
                    const uniqCount = uniq(results).length;
                    assert.ok(uniqCount > 1);
                });

            });
        });

        describe("with invalid input", () => {
            const testCases = [
                [55,11],
                ['bla',12],
                [undefined, 11]
            ];
            testCases.forEach((testCase) => {
                describe(`of ${JSON.stringify(testCase)}`, () => {
                    it("should return undefined", () => {
                        const actual = TimeFactory.fromHourRange.apply(undefined, testCase);
                        assert.equal(actual, undefined);
                    });
                });
            });
        });
    });

    describe("increment()", () => {
        describe("with valid input", () => {
            const testCases = [
                {
                    expected: "12:00",
                    input: ["11:00", 60]
                },
                {
                    expected: "12:30",
                    input: ["11:00", 90]
                },
                {
                    expected: "12:01",
                    input: ["11:00", 61]
                },
                {
                    expected: "15:40",
                    input: ["13:05", 155]
                },
                {
                    expected: "00:00",
                    input: ["23:45", 15]
                }
            ];

            testCases.forEach((testCase) => {
                describe(`of ${JSON.stringify(testCase.input)}`, () => {
                    it(`should return expected value: ${testCase.expected}`, () => {
                        const actual = TimeFactory.increment.apply(undefined, testCase.input);
                        assert.equal(actual, testCase.expected);
                    });
                });
            });
        });

        describe("with invalid input", () => {
            const testCases = [
                ['12:00', 'bla'],
                ['bla', 20]
            ];

            testCases.forEach((testCase) => {
                describe(`of ${JSON.stringify(testCase.input)}`, () => {
                    it(`should return undefined`, () => {
                        const actual = TimeFactory.increment.apply(undefined, testCase.input);
                        assert.equal(actual, undefined);
                    });
                });
            });
        });
    });
});
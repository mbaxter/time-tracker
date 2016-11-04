"use strict";

const assert = require('assert');
const stringPermutations = require('../../../../../../src/shared/util/string/permutations');

describe('stringPermutations()', () => {
    describe('with a single array representing an empty string', () => {
        it('should return a single empty string', () => {
            let actual = [... stringPermutations([])];
            assert.deepEqual(actual, ['']);
        });
    });

    describe('with a single array representing one definit string', () => {
        it('should return the single expected string', () => {
            let actual = [... stringPermutations(['a','b','c'])];
            assert.deepEqual(actual, ['abc']);
        });
    });

    describe('with a single array (representing definite and variable string components)', () => {
        let testCases = [
            {
                input: [['a','b'],'c','d'],
                expected: ['acd', 'bcd']
            },
            {
                input: ['c',['a','b'],'d'],
                expected: ['cad', 'cbd']
            },
            {
                input: ['c','d',['a','b']],
                expected: ['cda', 'cdb']
            },
            {
                input: [['a','b'],['c','d'],'e'],
                expected: ['ace', 'ade','bce','bde']
            },
            {
                input: [['a','b'],'e',['c','d']],
                expected: ['aec', 'aed','bec','bed']
            },
            {
                input: ['e', ['a','b'],['c','d']],
                expected: ['eac', 'ead','ebc','ebd']
            }
        ];
        testCases.forEach((testCase) => {
            describe(`of value: '${JSON.stringify(testCase.input)}'`, () => {
                it('should return the expected set of string', () => {
                    const actual = [... stringPermutations(testCase.input)];
                    assert.deepEqual(actual.sort(), testCase.expected.sort());
                });
            });
        });
    });

    describe('with multiple array inputs', () => {
        const testCases = [
            {
                input: [['abc'],[['d','e'],'f']],
                expected: ['abc','df','ef']
            }
        ];

        testCases.forEach((testCase) => {
            describe(`for input: ${JSON.stringify(testCase.input)}`, () => {
                it('should return permutations for all array inputs', () => {
                    const actual = [... stringPermutations.apply(undefined, testCase.input)];
                    assert.deepEqual(actual.sort(), testCase.expected.sort());
                });
            });
        });
    });
});
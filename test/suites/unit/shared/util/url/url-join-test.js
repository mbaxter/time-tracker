"use strict";

const assert = require('assert');
const urlJoin = require('../../../../../../src/shared/util/url/url-join');

describe("urlJoin()", () => {
    const testCases = [
        {
            input: ["http://test.com",'a','b'],
            expected: "http://test.com/a/b"
        },
        {
            input: ["https://test.com",'a','b'],
            expected: "https://test.com/a/b"
        },
        {
            input: ["a"],
            expected: "a"
        },
        {
            input: ["a","b"],
            expected: "a/b"
        },
        {
            input: ["a","b","c"],
            expected: "a/b/c"
        },
        {
            input: ["a","/"],
            expected: "a/"
        },
        {
            input: ["/","a"],
            expected: "/a"
        },
        {
            input: ["/a/","/b/","/","/"],
            expected: "/a/b/"
        },
        {
            input: ["a","","c"],
            expected: "a/c"
        },
        {
            input: ["a",""],
            expected: "a"
        },
        {
            input: ["","a"],
            expected: "a"
        },
        {
            input: ["/",""],
            expected: "/"
        },
        {
            input: [],
            expected: ""
        },
        {
            input: [""],
            expected: ""
        }
        ,
        {
            input: ["",""],
            expected: ""
        }
    ];

    testCases.forEach((testCase) => {
        describe(`with input: ${JSON.stringify(testCase.input)}`, () => {
            it(`should return expected output: ${testCase.expected}`, () => {
                const actual = urlJoin.apply(undefined, testCase.input);
                assert.equal(actual, testCase.expected);
            });
        });
    });
});
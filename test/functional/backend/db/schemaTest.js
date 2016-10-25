"use strict";
// Setup env variables
require('../../../../src/backend/env')();
const assert = require('assert');
const Schema = require('../../../../src/backend/db/schema');
const mysql = require('promise-mysql');
const Promise = require('bluebird');
const values = require('lodash/values');

const expectedTables = ["user", "time_block"];
const invalidTables = ["bla", "timeBlock"];

describe("Schema", function() {
    let schema;
    beforeEach(function() {
        schema = Schema.getInstance();
    });

    after(function() {
        schema.drop();
    });

    describe("getTable", function() {
        expectedTables.forEach(function(table) {
            describe(`called with valid table identifier '${table}'`, function() {
                it("should return a valid model", function() {
                    let model = schema.getTable(table);
                    assert.ok(model);
                });
            });
        });

        invalidTables.forEach(function(table) {
            describe(`called with invalid table identifier '${table}'`, function() {
                it("should throw an exception", function() {
                    assert.throws(() => schema.getTable(table));
                });
            });
        });
    });

    describe("forceSync", function() {
        let connection;
        before(function() {
            return mysql.createConnection(process.env.API_DB_URL)
                .then((conn) => {
                    connection = conn;
                }).then(() => {
                    return Promise.all(expectedTables.map((table) => {
                        return connection.query(`Drop table if exists ${table}`);
                    }))
                }).then(() => {
                    return connection.query(`Show tables`);
                }).then((response) => {
                    // Make sure we've successfully dropped all of our tables;
                    assert.equal(response.length, 0, "We should return 0 tables");
                }).then(() => {
                    // Finally, run forceSync after clearing the db
                    return schema.forceSync();
                }).catch((err) => {
                    assert.fail(err);
                });
        });

        describe("after executing", function() {
            describe("when retrieving list of tables", function() {
                it("should return a list of our expected tables", function() {
                    return connection.query(`Show tables`)
                        .then((response) => {
                            // formatResponse
                            const actualTables = response.reduce((accum, val) => {return accum.concat(values(val));}, []);
                            assert.equal(response.length, expectedTables.length, `We should return ${expectedTables.length} tables`);
                            assert.deepEqual(actualTables.sort(), expectedTables.sort());
                        })
                })
            });
        });
    });

    describe("drop", function() {
        let connection;
        before(function() {
            return mysql.createConnection(process.env.API_DB_URL)
                .then((conn) => {
                    connection = conn;
                }).then(() => {
                    // Create our tables
                    return schema.forceSync();
                }).then(() => {
                    return connection.query(`Show tables`);
                }).then((response) => {
                    // Make sure we've successfully dropped all of our tables;
                    assert.equal(response.length, expectedTables.length, "We should start out with some tables");
                }).then(() => {
                    return schema.drop();
                }).catch((err) => {
                    assert.fail(err);
                });
        });

        describe("after executing", function() {
            describe("when retrieving list of tables", function() {
                it("should get an empty list", function() {
                    return connection.query(`Show tables`)
                        .then((response) => {
                            assert.equal(response.length, 0, `We should get 0 tables`);
                        })
                })
            });
        });
    });
});
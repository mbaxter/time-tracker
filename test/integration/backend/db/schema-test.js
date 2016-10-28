"use strict";
// Setup env variables
require('../../../../src/backend/bootstrap');
const assert = require('assert');
const Schema = require('../../../../src/backend/db/schema');
const mysql = require('promise-mysql');
const Promise = require('bluebird');
const values = require('lodash/values');

const expectedTables = ["user", "time_block"];
const invalidTables = ["bla", "timeBlock"];

describe("Schema", () => {
    let schema;
    beforeEach(() => {
        schema = Schema.getInstance();
    });

    after(() => {
        schema.drop();
    });

    describe("getTable()", () => {
        describe("with a valid table identifier", () => {
            expectedTables.forEach(function(table) {
                describe(`of '${table}'`, () => {
                    it("should return a valid model", () => {
                        let model = schema.getTable(table);
                        assert.ok(model);
                    });
                });
            });
        });

        describe("with an invalid table identifier", () => {
            invalidTables.forEach(function(table) {
                describe(`of '${table}'`, () => {
                    it("should throw an exception", () => {
                        assert.throws(() => schema.getTable(table));
                    });
                });
            });
        });
    });

    describe("forceSync()", () => {
        let connection;
        before(() => {
            return mysql.createConnection(process.env.API_DB_URL)
                .then((conn) => {
                    connection = conn;
                }).then(() => {
                    return schema.drop();
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

        describe("after executing", () => {
            describe("when retrieving list of tables", () => {
                it("should return a list of our expected tables", () => {
                    return connection.query(`Show tables`)
                        .then((response) => {
                            // formatResponse
                            const actualTables = response.reduce((accum, val) => {return accum.concat(values(val));}, []);
                            assert.equal(response.length, expectedTables.length, `We should return ${expectedTables.length} tables`);
                            assert.deepEqual(actualTables.sort(), expectedTables.sort());
                        });
                });
            });
        });
    });

    describe("drop()", () => {
        let connection;
        before(() => {
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

        describe("after executing", () => {
            describe("when retrieving list of tables", () => {
                it("should get an empty list", () => {
                    return connection.query(`Show tables`)
                        .then((response) => {
                            assert.equal(response.length, 0, `We should get 0 tables`);
                        });
                });
            });
        });
    });
});
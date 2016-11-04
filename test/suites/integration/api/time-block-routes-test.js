"use strict";
require('../../../../src/backend/bootstrap');
const assert = require('assert');
const collection = require('../../../../src/backend/db/collection');
const httpCodes = require('http-status-codes');
const Schema = require('../../../../src/backend/db/schema');
const Fixtures = require('../../../helpers/fixtures');

const fetchApi = require('../../../../src/shared/fetch-api');
const DateTimeFormatter = require('../../../../src/shared/datetime/format/date-time-formatter');

const schema = Schema.getInstance();
const apiUrl = process.env.API_URL;
const timeBlocksApi = fetchApi.TimeBlocks.create(apiUrl);

describe('Api routes for handling time blocks', () => {
    // Setup some fixtures
    let fixtures;
    before(() => {
        return Fixtures.loadDefaults()
            .then((data) => {
                fixtures = data;
            });
    });

    after(() => {
        return schema.forceSync();
    });

    describe("/time-blocks", () => {
        let url;
        before(() => {
            url = `${apiUrl}/time-blocks`;
        });

        describe('POST request', () => {
            let timeBlock;
            let timeBlockUser, otherUser;
            before(() => {
                timeBlockUser = fixtures.users[0];
                otherUser = fixtures.users[1];
                timeBlock = {
                    user_id: timeBlockUser.id,
                    start: DateTimeFormatter.normalize("2016-01-01", "12:00", "UTC"),
                    end: DateTimeFormatter.normalize("2016-01-01", "13:00", "UTC")
                };
            });

            describe('with valid entry', () => {

                describe("and vaild auth token", () => {
                    it("should succeed and create a new entry", () => {
                        let initialEntryCount;
                        return collection.TimeBlock.count()
                            .then((count) => {
                                initialEntryCount = count;
                            })
                            .then(() => {
                                timeBlocksApi.authToken = Fixtures.getToken(fixtures, timeBlockUser.id);
                                return timeBlocksApi.insertRecord(timeBlock);
                            })
                            .then((response) => {
                                assert.ok(response.url, url, "Url we posted to should match our expectation");
                                assert.equal(response.status, httpCodes.CREATED);
                                return collection.TimeBlock.count();
                            }).then((newCount) => {
                                assert.equal(newCount, initialEntryCount + 1, "TimeBlock record count should increment by 1");
                            });
                    });
                });

                describe("and auth token for wrong user", () => {
                    it("should fail with a forbidden response", () => {
                        let initialEntryCount;
                        return collection.TimeBlock.count()
                            .then((count) => {
                                initialEntryCount = count;
                            })
                            .then(() => {
                                timeBlocksApi.authToken = Fixtures.getToken(fixtures, otherUser.id);
                                return timeBlocksApi.insertRecord(timeBlock);
                            })
                            .then((response) => {
                                assert.ok(response.url, url, "Url we posted to should match our expectation");
                                assert.equal(response.status, httpCodes.FORBIDDEN);
                                return collection.TimeBlock.count();
                            }).then((newCount) => {
                                assert.equal(newCount, initialEntryCount, "TimeBlock record count should not change");
                            });
                    });
                });

                describe("and no auth token", () => {
                    it("should fail with a authorization error", () => {
                        let initialEntryCount;
                        return collection.TimeBlock.count()
                            .then((count) => {
                                initialEntryCount = count;
                            })
                            .then(() => {
                                timeBlocksApi.authToken = null;
                                return timeBlocksApi.insertRecord(timeBlock);
                            })
                            .then((response) => {
                                assert.ok(response.url, url, "Url we posted to should match our expectation");
                                assert.equal(response.status, httpCodes.UNAUTHORIZED);
                                return collection.TimeBlock.count();
                            }).then((newCount) => {
                                assert.equal(newCount, initialEntryCount, "TimeBlock record count should not change");
                            });
                    });
                });
            });

            describe('with entry that fails validation', () => {
                it("should fail", () => {
                    let initialEntryCount;
                    return collection.TimeBlock.count()
                        .then((count) => {
                            initialEntryCount = count;
                        })
                        .then(() => {
                            const user = fixtures.users[0];
                            timeBlocksApi.authToken = Fixtures.getToken(fixtures, user.id);
                            return timeBlocksApi.insertRecord({
                                user_id: user.id,
                                start: DateTimeFormatter.normalize("2016-01-01", "12:00", "UTC")
                                // No end datetime
                            });
                        })
                        .then((response) => {
                            assert.ok(response.url, url, "Url we posted to should match our expectation");
                            assert.equal(response.status, httpCodes.BAD_REQUEST);
                            return collection.TimeBlock.count();
                        }).then((newCount) => {
                            assert.equal(newCount, initialEntryCount, "TimeBlock record count should not increment");
                        });
                });
            });

            describe('with improperly formatted data', () => {
                it("should fail", () => {
                    let initialEntryCount;
                    return collection.TimeBlock.count()
                        .then((count) => {
                            initialEntryCount = count;
                        })
                        .then(() => {
                            const user = fixtures.users[0];
                            timeBlocksApi.authToken = Fixtures.getToken(fixtures, user.id);
                            // Post an array instead of a single record
                            return timeBlocksApi.insertRecord([{
                                user_id: user.id,
                                start: DateTimeFormatter.normalize("2016-01-01", "12:00", "UTC"),
                                end: DateTimeFormatter.normalize("2016-01-01", "13:00", "UTC")
                            }]);
                        })
                        .then((response) => {
                            assert.ok(response.url, url, "Url we posted to should match our expectation");
                            assert.equal(response.status, httpCodes.BAD_REQUEST);
                            return collection.TimeBlock.count();
                        }).then((newCount) => {
                            assert.equal(newCount, initialEntryCount, "TimeBlock record count should not increment");
                        });
                });
            });
        });
    });


    describe('/user/<userId>/time-blocks', () => {
        describe("GET request", () => {
            describe("with valid auth token", () => {

            });
            describe("with no auth token", () => {

            });

            describe("with invalid auth token", () => {

            });
        });
    });
});

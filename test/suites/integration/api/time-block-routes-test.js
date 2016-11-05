"use strict";
require('../../../../src/backend/bootstrap');
const assert = require('assert');
const collection = require('../../../../src/backend/db/collection');
const httpCodes = require('http-status-codes');
const Schema = require('../../../../src/backend/db/schema');
const Fixtures = require('../../../helpers/fixtures');

const fetchApi = require('../../../../src/shared/fetch-api');
const DateTimeFormatter = require('../../../../src/shared/datetime/format/date-time-formatter');
const orderBy = require('lodash/orderBy');

const schema = Schema.getInstance();
const apiUrl = process.env.API_URL;
const timeBlocksApi = fetchApi.TimeBlocks.create(apiUrl);

describe('Api routes for handling time blocks', () => {
    after(() => {
        return schema.forceSync();
    });

    describe("/time-blocks", () => {
        // Setup some fixtures
        let fixtures, url;
        before(() => {
            url = `${apiUrl}/time-blocks`;
            return Fixtures.loadDefaults()
                .then((data) => {
                    fixtures = data;
                });
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


    describe('/users/<userId>/time-blocks', () => {
        // Setup some fixtures
        let fixtures;
        before(() => {
            return Fixtures.loadDefaults()
                .then((data) => {
                    fixtures = data;
                });
        });

        describe("GET request", () => {
            let user, otherUser;
            let expectedRecords;
            before(() => {
                user = fixtures.users[0];
                otherUser = fixtures.users[1];
                expectedRecords = Fixtures.getUserRecords(fixtures, user.id, "timeBlocks");
                // Expect records to come in descending order by start field
                expectedRecords = orderBy(expectedRecords, 'start', 'desc');
            });
            describe("with valid auth token", () => {
                describe("with no offset", () => {
                    it("should return all records successfully", () => {
                        timeBlocksApi.authToken = Fixtures.getToken(fixtures, user.id, 1000, 0);
                        return timeBlocksApi.getUserRecords(user.id)
                            .then((res) => {
                                assert.equal(res.status, httpCodes.OK);
                                assert.equal(res.url, `${apiUrl}/users/${user.id}/time-blocks?limit=1000&offset=0`);
                                return res.json();
                            }).then((json) => {
                                assert.deepEqual(json.records, expectedRecords);
                            });
                    });
                });

                describe("with offset and small limit", () => {
                    it("should return a subset of records successfully", () => {
                        timeBlocksApi.authToken = Fixtures.getToken(fixtures, user.id);
                        return timeBlocksApi.getUserRecords(user.id,1,1)
                            .then((res) => {
                                assert.equal(res.status, httpCodes.OK);
                                assert.equal(res.url, `${apiUrl}/users/${user.id}/time-blocks?limit=1&offset=1`);
                                return res.json();
                            }).then((json) => {
                                assert.deepEqual(json.records, expectedRecords.slice(1,2));
                            });
                    });
                });
            });

            describe("with no auth token", () => {
                it("should fail with unauthorized error", () => {
                    timeBlocksApi.authToken = null;
                    return timeBlocksApi.getUserRecords(user.id,1000,0)
                        .then((res) => {
                            assert.equal(res.status, httpCodes.UNAUTHORIZED);
                            assert.equal(res.url, `${apiUrl}/users/${user.id}/time-blocks?limit=1000&offset=0`);
                        });
                });
            });

            describe("with invalid auth token", () => {
                it("should fail with unauthorized error", () => {
                    timeBlocksApi.authToken = "X";
                    return timeBlocksApi.getUserRecords(user.id,1000,0)
                        .then((res) => {
                            assert.equal(res.status, httpCodes.UNAUTHORIZED);
                            assert.equal(res.url, `${apiUrl}/users/${user.id}/time-blocks?limit=1000&offset=0`);
                        });
                });
            });

            describe("with wrong auth token", () => {
                it("should fail with forbidden error", () => {
                    timeBlocksApi.authToken = Fixtures.getToken(fixtures, otherUser.id);
                    return  timeBlocksApi.getUserRecords(user.id,1000,0)
                        .then((res) => {
                            assert.equal(res.status, httpCodes.FORBIDDEN);
                            assert.equal(res.url, `${apiUrl}/users/${user.id}/time-blocks?limit=1000&offset=0`);
                        });
                });
            });
        });
    });

    describe('/time-blocks/<id>', () => {
        // Setup some fixtures
        let fixtures, adminUser, standardUser, adminToken, standardToken, adminTimeBlocks, standardTimeBlocks;
        beforeEach(() => {
            return Fixtures.loadDefaults()
                .then((data) => {
                    fixtures = data;
                    adminUser = fixtures.users[0];
                    standardUser = fixtures.users[1];
                    adminToken = Fixtures.getToken(fixtures, adminUser.id);
                    standardToken = Fixtures.getToken(fixtures, standardUser.id);
                    adminTimeBlocks = Fixtures.getUserRecords(fixtures, adminUser.id, 'timeBlocks');
                    standardTimeBlocks = Fixtures.getUserRecords(fixtures, standardUser.id, 'timeBlocks');
                });
        });

        describe("PATCH request", () => {
            describe("with timeBlockId matching authToken user", () => {
                it("should successfully update the record", () => {
                    let newDate = DateTimeFormatter.normalizeDate(new Date());
                    let timeBlockId = standardTimeBlocks[0].id;
                    timeBlocksApi.authToken = standardToken;
                    return timeBlocksApi.updateRecord(timeBlockId, {end: newDate})
                        .then((res) => {
                            assert.equal(res.url, `${apiUrl}/time-blocks/${timeBlockId}`);
                            assert.equal(res.status, httpCodes.OK);
                            return res.json();
                        }).then((json) => {
                            assert.ok(json.record);
                            assert.equal(json.record.end, newDate);
                        });
                });
            });

            describe("with admin authToken and timeBlockId belonging to different user", () => {
                it("should successfully update the record", () => {
                    let newDate = DateTimeFormatter.normalizeDate(new Date());
                    let timeBlockId = standardTimeBlocks[0].id;
                    timeBlocksApi.authToken = adminToken;
                    return timeBlocksApi.updateRecord(timeBlockId, {end: newDate})
                        .then((res) => {
                            assert.equal(res.url, `${apiUrl}/time-blocks/${timeBlockId}`);
                            assert.equal(res.status, httpCodes.OK);
                            return res.json();
                        }).then((json) => {
                            assert.ok(json.record);
                            assert.equal(json.record.end, newDate);
                        });
                });
            });

            describe("with standard authToken and timeBlockId belonging to different user", () => {
                it("should fail with a 'Not Found' error", () => {
                    let newDate = DateTimeFormatter.normalizeDate(new Date());
                    let timeBlockId = adminTimeBlocks[0].id;
                    timeBlocksApi.authToken = standardToken;
                    return timeBlocksApi.updateRecord(timeBlockId, {end: newDate})
                        .then((res) => {
                            assert.equal(res.url, `${apiUrl}/time-blocks/${timeBlockId}`);
                            assert.equal(res.status, httpCodes.FORBIDDEN);
                        });
                });
            });

            describe("with valid authToken and non-existent timeBlockId", () => {
                it ("should fail with a 'Not Found' error", () => {
                    let newDate = DateTimeFormatter.normalizeDate(new Date());
                    let timeBlockId = 999999;
                    timeBlocksApi.authToken = standardToken;
                    return timeBlocksApi.updateRecord(timeBlockId, {end: newDate})
                        .then((res) => {
                            assert.equal(res.url, `${apiUrl}/time-blocks/${timeBlockId}`);
                            assert.equal(res.status, httpCodes.NOT_FOUND);
                        });
                });
            });

            describe("with no authToken", () => {
                it("should fail with an 'Unauthorized' error", () => {
                    let newDate = DateTimeFormatter.normalizeDate(new Date());
                    let timeBlockId = standardTimeBlocks[0].id;
                    timeBlocksApi.authToken = null;
                    return timeBlocksApi.updateRecord(timeBlockId, {end: newDate})
                        .then((res) => {
                            assert.equal(res.url, `${apiUrl}/time-blocks/${timeBlockId}`);
                            assert.equal(res.status, httpCodes.UNAUTHORIZED);
                        });
                });
            });

            describe("with admin authToken and a payload that updates userId", () => {
                it("should fail with a 'Bad Request' error", () => {
                    let timeBlockId = adminTimeBlocks[0].id;
                    timeBlocksApi.authToken = adminToken;
                    return timeBlocksApi.updateRecord(timeBlockId, {user_id: standardUser.id})
                        .then((res) => {
                            assert.equal(res.url, `${apiUrl}/time-blocks/${timeBlockId}`);
                            assert.equal(res.status, httpCodes.BAD_REQUEST);
                        });
                });
            });
        });

        describe("DELETE request", () => {
            describe("with timeBlockId matching authToken user", () => {
                it("should successfully delete the record", () => {
                    let timeBlockId = standardTimeBlocks[0].id;
                    timeBlocksApi.authToken = standardToken;
                    let initialCount;
                    return collection.TimeBlock.count()
                        .then((count) => {
                            initialCount = count;
                            return timeBlocksApi.deleteRecord(timeBlockId);
                        }).then((res) => {
                            assert.equal(res.url, `${apiUrl}/time-blocks/${timeBlockId}`);
                            assert.equal(res.status, httpCodes.OK);
                            return collection.TimeBlock.count();
                        }).then((finalCount) => {
                            assert.equal(finalCount, initialCount - 1, "One record should be deleted");

                        });
                });
            });

            describe("with admin authToken and timeBlockId belonging to different user", () => {
                it("should successfully delete the record", () => {
                    let timeBlockId = standardTimeBlocks[0].id;
                    timeBlocksApi.authToken = adminToken;
                    let initialCount;
                    return collection.TimeBlock.count()
                        .then((count) => {
                            initialCount = count;
                            return timeBlocksApi.deleteRecord(timeBlockId);
                        }).then((res) => {
                            assert.equal(res.url, `${apiUrl}/time-blocks/${timeBlockId}`);
                            assert.equal(res.status, httpCodes.OK);
                            return collection.TimeBlock.count();
                        }).then((finalCount) => {
                            assert.equal(finalCount, initialCount - 1, "One record should be deleted");

                        });
                });
            });

            describe("with standard authToken and timeBlockId belonging to different user", () => {
                it("should fail with a 'Not Found' error", () => {
                    let timeBlockId = adminTimeBlocks[0].id;
                    timeBlocksApi.authToken = standardToken;
                    let initialCount;
                    return collection.TimeBlock.count()
                        .then((count) => {
                            initialCount = count;
                            return timeBlocksApi.deleteRecord(timeBlockId);
                        }).then((res) => {
                            assert.equal(res.url, `${apiUrl}/time-blocks/${timeBlockId}`);
                            assert.equal(res.status, httpCodes.FORBIDDEN);
                            return collection.TimeBlock.count();
                        }).then((finalCount) => {
                            assert.equal(finalCount, initialCount, "No records should be deleted");
                        });
                });
            });

            describe("with valid authToken and non-existent timeBlockId", () => {
                it ("should fail with a 'Not Found' error", () => {
                    let timeBlockId = 999999;
                    timeBlocksApi.authToken = standardToken;
                    let initialCount;
                    return collection.TimeBlock.count()
                        .then((count) => {
                            initialCount = count;
                            return timeBlocksApi.deleteRecord(timeBlockId);
                        }).then((res) => {
                            assert.equal(res.url, `${apiUrl}/time-blocks/${timeBlockId}`);
                            assert.equal(res.status, httpCodes.NOT_FOUND);
                            return collection.TimeBlock.count();
                        }).then((finalCount) => {
                            assert.equal(finalCount, initialCount, "No records should be deleted");
                        });
                });
            });

            describe("with no authToken", () => {
                it("should fail with an 'Unauthorized' error", () => {
                    let timeBlockId = standardTimeBlocks[0].id;
                    timeBlocksApi.authToken = null;
                    let initialCount;
                    return collection.TimeBlock.count()
                        .then((count) => {
                            initialCount = count;
                            return timeBlocksApi.deleteRecord(timeBlockId);
                        }).then((res) => {
                            assert.equal(res.url, `${apiUrl}/time-blocks/${timeBlockId}`);
                            assert.equal(res.status, httpCodes.UNAUTHORIZED);
                            return collection.TimeBlock.count();
                        }).then((finalCount) => {
                            assert.equal(finalCount, initialCount, "No records should be deleted");
                        });
                });
            });
        });
    });

});

"use strict";
// Setup env variables
require('../../../../src/backend/bootstrap');
const assert = require("assert");
const clone = require('lodash/clone');
const collection = require('../../../../src/backend/db/collection');
const httpCodes = require('http-status-codes');
const Schema = require('../../../../src/backend/db/schema');
const schema = Schema.getInstance();
const UsersApi = require('../../../../src/shared/fetch-api/users');
const Fixtures = require('../../../helpers/fixtures');
const QueryOptionsBuilder = require('../../../../src/backend/db/query/query-options-builder');

const apiUrl = process.env.API_URL;
const usersApi = UsersApi.create(apiUrl);

describe("Api endpoints for handling users", () => {
    after(() => {
        return schema.forceSync();
    });

    describe("/users", () => {
        let url;
        let fixtures;
        let existingUser;
        before(() => {
            url = `${apiUrl}/users`;
            return Fixtures.loadDefaults()
                .then((data) => {
                    fixtures = data;
                    existingUser = fixtures.users[0];
                });
        });

        describe("get request", () => {
            describe("with valid admin auth token", () => {
                it("should return all of the users", () => {
                    usersApi.authToken = Fixtures.getToken(fixtures, fixtures.users[0].id);
                    return usersApi.getRecords()
                        .then((res) => {
                            assert.equal(res.status, httpCodes.OK);
                            assert.equal(res.url.indexOf(`${apiUrl}/users?`), 0);
                            return res.json();
                        }).then((json) => {
                            assert.ok(json.records);
                            assert.equal(json.records.length, fixtures.users.length);
                        });
                });
            });

            describe("with valid standard auth token", () => {
                it("should return a forbidden error", () => {
                    usersApi.authToken = Fixtures.getToken(fixtures, fixtures.users[1].id);
                    return usersApi.getRecords()
                        .then((res) => {
                            assert.equal(res.status, httpCodes.FORBIDDEN);
                            assert.equal(res.url.indexOf(`${apiUrl}/users?`), 0);
                        });
                });
            });

            describe("with no auth token", () => {
                it("should return an authentication error", () => {
                    usersApi.authToken = null;
                    return usersApi.getRecords()
                        .then((res) => {
                            assert.equal(res.status, httpCodes.UNAUTHORIZED);
                            assert.equal(res.url.indexOf(`${apiUrl}/users?`), 0);
                        });
                });
            });
        });

        describe("post request", () => {
            describe("with new, valid user", () => {
                it("should succeed and create a new user", () => {
                    const newUser = {
                        email_address: "new.user@test.com",
                        password: "password"
                    };

                    let priorUserCount;
                    return collection.User.count()
                        .then((count) => {
                            priorUserCount = count;

                            // After we get existing count, post a new user
                            return usersApi.insertRecord(newUser);
                        })
                        .then((res) => {
                            assert.equal(res.url, url, "We should post to the url we're expecting");
                            assert.equal(res.status, httpCodes.CREATED);

                        })
                        .then(() => {
                            return collection.User.count();
                        }).then((newCount) => {
                            assert.equal(newCount, priorUserCount + 1, "We should have one more user in the db");
                        })
                        .then(() => {
                            return collection.User.retrieveOneByEmailAddressAndPassword(newUser.email_address, newUser.password);
                        })
                        .then((actualUser) => {
                            assert.ok(actualUser);
                            assert.equal(actualUser.email_address, newUser.email_address);
                            // Make sure password was hashed
                            assert.ok(actualUser.password);
                            assert.notEqual(actualUser.password, newUser.password);
                        });
                });
            });

            describe("with credentials matching an existing user", () => {
                it("should fail and indicate a conflict", () => {
                    let priorUserCount;
                    return collection.User.count()
                        .then((count) => {
                            priorUserCount = count;

                            // After we get existing count, post a new user
                            return usersApi.insertRecord(existingUser);
                        })
                        .then((res) => {
                            assert.equal(res.url, url, "We should post to the url we're expecting");
                            assert.equal(res.status, httpCodes.CONFLICT);

                            // Count users again
                            return collection.User.count();
                        })
                        .then((newCount) => {
                            assert.equal(newCount, priorUserCount, "We should have the same number of users");
                        });
                });
            });

            describe("with missing required field", () => {
                ['email_address', 'password'].forEach((field) => {
                    describe(`of "${field}"`, () => {
                        let newUser;
                        before(() => {
                            newUser = {
                                email_address: "new.user.missing.fields@test.com",
                                password: "password"
                            };
                            delete newUser[field];
                        });

                        it("should fail and indicate a client error", () => {
                            let priorUserCount;
                            const userData = clone(newUser);
                            delete userData[field];
                            return collection.User.count()
                                .then((count) => {
                                    priorUserCount = count;

                                    // After we get existing count, post a new user
                                    return usersApi.insertRecord(userData);
                                })
                                .then((res) => {
                                    assert.equal(res.url, url, "We should post to the url we're expecting");
                                    assert.equal(res.status, httpCodes.BAD_REQUEST);

                                    // Count users again
                                    return collection.User.count();
                                })
                                .then((newCount) => {
                                    assert.equal(newCount, priorUserCount, "We should have the same number of users");
                                });
                        });
                    });
                });
            });

        });
    });

    describe("users/id", () => {
        let fixtures, adminUser, standardUser, adminToken, standardToken;
        beforeEach(() => {
            return Fixtures.loadDefaults()
                .then((data) => {
                    fixtures = data;
                    adminUser = fixtures.users[0];
                    standardUser = fixtures.users[1];
                    adminToken = Fixtures.getToken(fixtures, adminUser.id);
                    standardToken = Fixtures.getToken(fixtures, standardUser.id);
                });
        });

        describe("PATCH request", () => {
            describe("against standard user with that user's auth token", () => {
                 it("should successfully update the user", () => {
                     const newEmail = "new.email@test.com";
                     usersApi.authToken = standardToken;
                     return usersApi.updateRecord(standardUser.id, {email_address: newEmail})
                         .then((res) => {
                             assert.equal(res.url, `${apiUrl}/users/${standardUser.id}`);
                             assert.equal(res.status, httpCodes.OK);
                             return res.json();
                         }).then((json) => {
                             assert.ok(json.record && json.record.email_address);
                             assert.equal(json.record.email_address, newEmail);
                         });
                 });
            });

            describe("against standard user with an admin's auth token", () => {
                it("should successfully update the user", () => {
                    const newEmail = "new.email@test.com";
                    usersApi.authToken = adminToken;
                    return usersApi.updateRecord(standardUser.id, {email_address: newEmail})
                        .then((res) => {
                            assert.equal(res.url, `${apiUrl}/users/${standardUser.id}`);
                            assert.equal(res.status, httpCodes.OK);
                            return res.json();
                        }).then((json) => {
                            assert.ok(json.record && json.record.email_address);
                            assert.equal(json.record.email_address, newEmail);
                        });
                });
            });

            describe("against one user with a different non-admin user's token", () => {
                it("should fail with error forbidden", () => {
                    const newEmail = "new.email@test.com";
                    usersApi.authToken = standardToken;
                    return usersApi.updateRecord(adminUser.id, {email_address: newEmail})
                        .then((res) => {
                            assert.equal(res.url, `${apiUrl}/users/${adminUser.id}`);
                            assert.equal(res.status, httpCodes.FORBIDDEN);
                        });
                });
            });

            describe("with no auth token", () => {
                it("should fail with error unauthorized", () => {
                    const newEmail = "new.email@test.com";
                    usersApi.authToken = null;
                    return usersApi.updateRecord(standardUser.id, {email_address: newEmail})
                        .then((res) => {
                            assert.equal(res.url, `${apiUrl}/users/${standardUser.id}`);
                            assert.equal(res.status, httpCodes.UNAUTHORIZED);
                        });
                });
            });
        });

        describe("DELETE request", () => {
            let standardTimeBlocks;
            before(() => {
                standardTimeBlocks = Fixtures.getUserRecords(fixtures, standardUser.id, 'timeBlocks');
            });
            describe("with id matching authToken user", () => {
                it("should successfully delete the record and its child records", () => {
                    let userId = standardUser.id;
                    usersApi.authToken = standardToken;
                    let initialCount;
                    return collection.User.count()
                        .then((count) => {
                            initialCount = count;
                            return usersApi.deleteRecord(userId);
                        }).then((res) => {
                            assert.equal(res.url, `${apiUrl}/users/${userId}`);
                            assert.equal(res.status, httpCodes.OK);
                            return collection.User.count();
                        }).then((finalCount) => {
                            assert.equal(finalCount, initialCount - 1, "One record should be deleted");
                            return collection.TimeBlock.count(QueryOptionsBuilder.create().where('user_id',userId));
                        }).then((finalCount) => {
                            assert.equal(finalCount, 0, "All owned timeBlocks should be deleted");
                        });
                });
            });

            describe("with admin authToken and id belonging to different user", () => {
                it("should successfully delete the record", () => {
                    let userId = standardUser.id;
                    usersApi.authToken = adminToken;
                    let initialCount;
                    return collection.User.count()
                        .then((count) => {
                            initialCount = count;
                            return usersApi.deleteRecord(userId);
                        }).then((res) => {
                            assert.equal(res.url, `${apiUrl}/users/${userId}`);
                            assert.equal(res.status, httpCodes.OK);
                            return collection.User.count();
                        }).then((finalCount) => {
                            assert.equal(finalCount, initialCount - 1, "One record should be deleted");
                            return collection.TimeBlock.count(QueryOptionsBuilder.create().where('user_id',userId));
                        }).then((finalCount) => {
                            assert.equal(finalCount, 0, "All owned timeBlocks should be deleted");
                        });
                });
            });

            describe("with standard authToken and id belonging to different user", () => {
                it("should fail with a 'Not Found' error", () => {
                    let userId = adminUser.id;
                    usersApi.authToken = standardToken;
                    let initialCount;
                    let initialTimeBlockCount = standardTimeBlocks.length;
                    return collection.User.count()
                        .then((count) => {
                            initialCount = count;
                            return usersApi.deleteRecord(userId);
                        }).then((res) => {
                            assert.equal(res.url, `${apiUrl}/users/${userId}`);
                            assert.equal(res.status, httpCodes.FORBIDDEN);
                            return collection.User.count();
                        }).then((finalCount) => {
                            assert.equal(finalCount, initialCount, "No records should be deleted");
                            return collection.TimeBlock.count(QueryOptionsBuilder.create().where('user_id',userId));
                        }).then((finalCount) => {
                            assert.equal(finalCount, initialTimeBlockCount, "No timeBlocks should be deleted");
                        });
                });
            });

            describe("with valid authToken and non-existent userId", () => {
                it ("should fail with a 'Not Found' error", () => {
                    let userId = 999999;
                    usersApi.authToken = standardToken;
                    let initialCount;
                    return collection.User.count()
                        .then((count) => {
                            initialCount = count;
                            return usersApi.deleteRecord(userId);
                        }).then((res) => {
                            assert.equal(res.url, `${apiUrl}/users/${userId}`);
                            assert.equal(res.status, httpCodes.NOT_FOUND);
                            return collection.User.count();
                        }).then((finalCount) => {
                            assert.equal(finalCount, initialCount, "No records should be deleted");
                        });
                });
            });

            describe("with no authToken", () => {
                it("should fail with an 'Unauthorized' error", () => {
                    let userId = standardUser.id;
                    usersApi.authToken = null;
                    let initialCount;
                    let initialTimeBlockCount = standardTimeBlocks.length;
                    return collection.User.count()
                        .then((count) => {
                            initialCount = count;
                            return usersApi.deleteRecord(userId);
                        }).then((res) => {
                            assert.equal(res.url, `${apiUrl}/users/${userId}`);
                            assert.equal(res.status, httpCodes.UNAUTHORIZED);
                            return collection.User.count();
                        }).then((finalCount) => {
                            assert.equal(finalCount, initialCount, "No records should be deleted");
                            return collection.TimeBlock.count(QueryOptionsBuilder.create().where('user_id',userId));
                        }).then((finalCount) => {
                            assert.equal(finalCount, initialTimeBlockCount, "No timeBlocks should be deleted");
                        });
                });
            });
        });
    });

    describe("users/me", () => {
        let fixtures;
        before(() => {
            return Fixtures.loadDefaults()
                .then((data) => {
                    fixtures = data;
                });
        });

        describe("GET request", () => {
            describe("with valid auth token", () => {
                it("should return the current user", () => {
                    const user = fixtures.users[0];
                    usersApi.authToken = Fixtures.getToken(fixtures, user.id);
                    return usersApi.getCurrentUser()
                        .then((res) => {
                            assert.equal(res.status, httpCodes.OK);
                            assert.equal(res.url, `${apiUrl}/users/me`);
                            return res.json();
                        }).then((json) => {
                            assert.ok(json.record);
                            assert.equal(json.record.id, user.id);
                            assert.equal(json.record.email_address, user.email_address);
                            assert.ok(json.record.password == undefined, "Password shouldn't be sent back");
                        });
                });
            });

            describe("with invalid auth token", () => {
                it("should fail", () => {
                    const user = fixtures.users[0];
                    usersApi.authToken = Fixtures.getToken(fixtures, user.id).slice(1);
                    return usersApi.getCurrentUser()
                        .then((res) => {
                            assert.equal(res.status, httpCodes.UNAUTHORIZED);
                            assert.equal(res.url, `${apiUrl}/users/me`);
                        });
                });
            });

            describe("with no auth token", () => {
                it("should fail", () => {
                    usersApi.authToken = null;
                    return usersApi.getCurrentUser()
                        .then((res) => {
                            assert.equal(res.status, httpCodes.UNAUTHORIZED);
                            assert.equal(res.url, `${apiUrl}/users/me`);
                        });
                });
            });
        });
    });
});

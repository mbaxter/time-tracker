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

const apiUrl = process.env.API_URL;
const usersApi = UsersApi.create(apiUrl);

describe("Api endpoints for handling users", () => {
    // Setup some users with login tokens
    let fixtures;
    let existingUser;
    before(() => {
        return Fixtures.loadDefaults()
            .then((data) => {
                fixtures = data;
                existingUser = fixtures.users[0];
            });
    });

    after(() => {
        return schema.forceSync();
    });

    describe("/users", () => {
        let url;
        before(() => {
            url = `${apiUrl}/users`;
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

    describe("users/me", () => {
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

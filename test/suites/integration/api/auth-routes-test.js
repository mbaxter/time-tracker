"use strict";
// Setup env variables
require('../../../../src/backend/bootstrap');
const assert = require("assert");
const Fixtures = require('../../../helpers/fixtures');
const Schema = require('../../../../src/backend/db/schema');
const schema = Schema.getInstance();
const httpCodes = require('http-status-codes');
const AuthApi = require('../../../../src/shared/fetch-api/auth');

const apiUrl = process.env.API_URL;
const authApi = AuthApi.create(apiUrl);

describe("Api endpoints for authentication", () => {
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

    describe("/auth/login", () => {
        let url, user1;
        before(() => {
            user1 = fixtures.users[0];
            url = `${apiUrl}/auth/login`;
        });

        describe("post request", () => {
            describe("with valid credentials", () => {
                it("should return a valid response with a token", () => {
                    return authApi.login(user1.email_address, user1.password)
                        .then((response) => {
                            assert.equal(response.url, url, "Url should match what we're expecting to test");
                            assert.equal(response.status, httpCodes.OK);
                            return response.json();
                        })
                        .then((json) => {
                            const token = json.token;
                            assert.ok(typeof token == 'string');
                            assert.ok(token.length > 0);
                        });
                });
            });

            describe("with invalid credentials", () => {
                const testCases = [
                    {
                        case: "matching email, wrong password",
                        getCredentials: (user) => {
                            return [
                                user.email_address,
                                user.password + 'bla'
                            ];
                        }
                    },
                    {
                        case: "matching password, wrong email",
                        getCredentials: (user) => {
                            return [
                                'some.other.person@test.com',
                                user.password
                            ];
                        }
                    },
                    {
                        case: "wrong email and password",
                        getCredentials: (user) => {
                            return [
                                'some.other.person@test.com',
                                user.password + 'bla'];
                        }
                    }
                ];

                testCases.forEach((testCase) => {
                    describe(`with ${testCase.case}`, () => {
                        it("should return an unauthorized response with no token", () => {
                            return authApi.login(... testCase.getCredentials(user1))
                                .then((response) => {
                                    assert.equal(response.url, url, "Url should match what we're expecting to test");
                                    assert.equal(response.status, httpCodes.UNAUTHORIZED);
                                    return response.json();
                                }).then((json) => {
                                    const token = json.token;
                                    assert.ok(typeof token == 'undefined');
                                });
                        });
                    });
                });
            });

            describe("with missing required field", () => {
                ['email_address','password'].forEach((field) => {
                    describe(`of: "${field}"`, () => {
                        let data;
                        before(() => {
                            data = {
                                email_address: user1.email_address,
                                password: user1.password
                            };

                            delete data[field];
                        });

                        it("should return a response indicating the request is bad", () => {
                            return authApi.post("/auth/login", data)
                                .then((response) => {
                                    assert.equal(response.url, url, "Url should match what we're expecting to test");
                                    assert.equal(response.status, httpCodes.BAD_REQUEST);
                                    return response.json();
                                }).then((json) => {
                                    const token = json.token;
                                    assert.ok(typeof token == 'undefined');
                                });
                        });
                    });
                });
            });
        });
    });
});
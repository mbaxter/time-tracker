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
    // Setup some users with login tokens
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
            let timeBlockData;
            before(() => {
                const user = fixtures.users[0];
                timeBlockData = {
                    user_id: user.id,
                    start: DateTimeFormatter.normalize("2016-01-01", "12:00", "UTC"),
                    end: DateTimeFormatter.normalize("2016-01-01", "13:00", "UTC")
                };
            });

            describe('with valid entry', () => {
                let initialEntryCount;
                let request;
                before(() => {
                    return collection.TimeBlock.count()
                        .then((count) => {
                            initialEntryCount = count;
                        }).then(() => {
                            timeBlocksApi.authToken = Fixtures.getToken(fixtures, timeBlockData.user_id);
                            request = timeBlocksApi.insertRecord(timeBlockData);
                            return request;
                        });
                });
                it("should succeed and create a new entry", () => {
                    return request.then((response) => {
                        assert.ok(response.url, url, "Url we posted to should match our expectation");
                        assert.equal(response.status, httpCodes.CREATED);
                        return collection.TimeBlock.count();
                    }).then((newCount) => {
                        assert.equal(newCount, initialEntryCount + 1, "TimeBlock record count should increment by 1");
                    });
                });
            });

            describe('with entry fails validation', () => {

            });

            describe('with improperly formatted data', () => {

            });

            describe('with no data', () => {

            });

            describe('with valid entry for wrong user', () => {

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
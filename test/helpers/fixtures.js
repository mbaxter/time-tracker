"use strict";
const defaultFixturesLoader = require('../../src/backend/db/fixtures/loaders/default-fixtures-loader');
const userJwt = require('../../src/backend/security/user-jwt');
const Promise = require('bluebird');

const Fixtures = {};

const appendToUserIdToRecordsMap = function(userIdToRecords, userId, collectionName, record) {
    if (!userIdToRecords[userId]) {
        userIdToRecords[userId] = {};
    }
    if (!userIdToRecords[userId][collectionName]) {
        userIdToRecords[userId][collectionName] = [];
    }

    userIdToRecords[userId][collectionName].push(record);
    return userIdToRecords;
};

Fixtures.loadDefaults = function() {
    return defaultFixturesLoader({days: 1, blocksPerDay: [2,2]})
        .then((fixtures) => {
            // Add mapping from userId to valid auth token
            fixtures.userIdToToken = {};
            return Promise.map(fixtures.users, (user) => {
                return userJwt.sign(user)
                    .then((token) => {
                        fixtures.userIdToToken[user.id] = token;
                    });
            }).then(() => {
                 return fixtures;
            });
        })
        .then((fixtures) => {
            // Add additional data mapping user to the objects the user owns
            const userIdToRecords = {};
            fixtures.timeBlocks.forEach((timeBlock) => {
                const userId = timeBlock.user_id;
                appendToUserIdToRecordsMap(userIdToRecords, userId, "timeBlocks", timeBlock);
            });
            fixtures.userIdToRecords = userIdToRecords;
            return fixtures;
        });
};

Fixtures.getToken = function(fixtures, userId) {
    return fixtures.userIdToToken[userId];
};

Fixtures.getUserRecords = function(fixtures, userId, collectionName) {
    const userRecords = fixtures.userIdToRecords[userId];
    let records = userRecords ? userRecords[collectionName] : [];
    return records || [];
};

module.exports = Fixtures;
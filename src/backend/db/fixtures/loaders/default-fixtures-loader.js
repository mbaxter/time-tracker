"use strict";
const Schema = require('../../schema');
const userFixtures = require('../data/user-fixtures');
const timeBlockGenerator = require('../generators/time-block-generator');
const FixtureLoader = require('../fixture-loader');

const schema = Schema.getInstance();

/**
 * @return Promise
 */
module.exports = function({days = 100} = {}) {
    return schema.forceSync()
        .then(() => {
           // generate TimeBlock fixtures
            const timeBlockChunks = userFixtures.map((user, index) => {
                return timeBlockGenerator({userId: index, timezone: user.timezone, days:days});
            });

            return Array.prototype.concat.apply([], timeBlockChunks);
        })
        .then((timeBlocks) => {
            return {
                users: userFixtures,
                timeBlocks: timeBlocks
            };
        })
        .then((fixtures) => {
            return FixtureLoader.load(fixtures);
        });
};
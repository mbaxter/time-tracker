"use strict";
const Schema = require('../../schema');
const userFixtures = require('../data/user-fixtures');
const timeBlockGenerator = require('../generators/time-block-generator');
const FixtureLoader = require('../fixture-loader');

const schema = Schema.getInstance();

/**
 * @return Promise
 */
module.exports = function() {
    return schema.forceSync()
        .then(() => {
           // generate TimeBlock fixtures
            const timeBlockChunks = userFixtures.map((user, index) => {
                return timeBlockGenerator({userId: index, timezone: user.timezone, days:100});
            });

            return Array.prototype.concat.apply([], timeBlockChunks);
        })
        .then((timeBlocks) => {
            return {
                user: userFixtures,
                time_block: timeBlocks
            };
        })
        .then((fixtures) => {
            return FixtureLoader.load(fixtures);
        });
};
"use strict";
const random = require('lodash/random');
const DateTimeFormatter = require('../../../../shared/datetime/format/date-time-formatter');
const DateFactory = require('../../../../shared/datetime/factory/date-factory');
const TimeFactory = require('../../../../shared/datetime/factory/time-factory');

/**
 * @param {*} options
 * @param {number} options.days
 * @param {number} options.userId
 * @param {string} timezone
 * @returns {Array} Returns an array of timeBlock fixtures
 */
const timeBlockGenerator = function({
    days = 100,
    userId = null,
    timezone = 'UTC',
} = {}) {
    const fixtures = [];

    // Block duration in minutes
    const blockDuration = 50;
    // Range of how much time to put between blocks

    let date = DateFactory.today();
    for (let i = 0; i < days; i++) {
        let numBlocks = getNumBlocks(0,7);
        let time = TimeFactory.fromHourRange(9,11);
        for (let j = 0; j < numBlocks; j++) {
            let blockStart = time;
            time = TimeFactory.increment(time, blockDuration);
            let blockEnd = time;
            fixtures.push({
                user_id: userId,
                start: DateTimeFormatter.normalize(date, blockStart, timezone),
                end: DateTimeFormatter.normalize(date, blockEnd, timezone),
            });
            // Add some time between blocks
            time = TimeFactory.increment(time, random(10,30));
        }
        date = DateFactory.increment(date, -1);
    }

    return fixtures;
};

/**
 * Determine how many blocks we're going to make for the current date
 * @returns {number}
 */
const getNumBlocks = function(min, max) {
    const span = max - min;
    // Weight num blocks toward the maximum end of the range
    let t = 1 - Math.pow(Math.random(), 2);
    return Math.round(t * span + min);
};

module.exports = timeBlockGenerator;
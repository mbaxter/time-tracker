"use strict";
const moment = require('moment');
const random = require('lodash/random');
const DateTimeFormatter = require('../../../../shared/datetime/date-time-formatter');

const timeBlockGenerator = function({
    days = 100,
    userId = null,
    timezone = 'UTC',
} = {}) {
    const fixtures = [];

    // Block duration in minutes
    const blockDuration = 50;
    // Range of how much time to put between blocks

    let date = today();
    for (let i = 0; i < days; i++) {
        let numBlocks = getNumBlocks();
        let time = getStartTime();
        for (let j = 0; j < numBlocks; j++) {
            let blockStart = time;
            let blockEnd = incrementTime(time, blockDuration);
            fixtures.push({
                user_id: userId,
                start: DateTimeFormatter.normalize(date, blockStart, timezone),
                end: DateTimeFormatter.normalize(date, blockEnd, timezone),
            });
            time = incrementTime(time, getRestDuration());
        }
        date = incrementDate(date);
    }
};

const today = function(dateFormat = 'YYYY-MM-DD') {
    return moment().formate(dateFormat);
};

/**
 * Generate the time to start the first block of the day
 * @returns {string}
 */
const getStartTime = function() {
    // Start between 9 and 11 am
    const hour = random(9,10);
    const minute = random(0,59);
    return `${hour}:${minute} am`;
};

/**
 * Return the number of minutes to wait between the end of the last block
 * and the beginning of the next
 */
const getRestDuration = () => {
    const restDuration = [10, 30];
    return random(... restDuration);
};

/**
 * Determine how many blocks we're going to make for the current date
 * @returns {number}
 */
const getNumBlocks = function() {
    // Range of how many blocks per day
    const range = [0,5];
    const span = range[1] - range[0];
    const min = range[0];
    // Weight num blocks toward the maximum end of the range
    let t = 1 - Math.pow(Math.random(), 2);
    return Math.round(t * span + min);
};

const incrementTime = function(time, minutesToIncrement, timeFormat='hh:mm a') {
    moment(time, timeFormat).add(minutesToIncrement, 'minutes').format(timeFormat);
};

const incrementDate = function(date, dayIncrement = 1, dateFormat='YYYY-MM-DD') {
    return moment(date, dateFormat).add(dayIncrement, 'days').formate(dateFormat);
};

module.exports = timeBlockGenerator;
/**
 * Utility for creating time values.
 * Times are returned in HH:mm format.
 * Input times are assumed to be in HH:mm format.
 */
"use strict";
const random = require('lodash/random');
const isNumber = require('lodash/isNumber');
const padStart = require('lodash/padStart');
const moment = require('moment');

const TimeFactory = {};

const format = "HH:mm";

/**
 * Given the hour range somewhere in [0,23], returns a time formatted in HH:mm format that exists in the
 * range inclusively
 * @param {number} hourMin
 * @param {number} hourMax
 * @returns {*}
 */
TimeFactory.fromHourRange = function(hourMin, hourMax) {
    if(!TimeFactory._validateHour(hourMin) || !TimeFactory._validateHour(hourMax)) {
        return undefined;
    }

    let hour = random(hourMin, hourMax);
    let minutes = '00';
    if (hour != hourMax) {
        minutes = padStart(random(0,59) + '', 2, '0');
    }
    hour = padStart(hour + '', 2, '0');
    return `${hour}:${minutes}`;
};

/**
 *
 * @param time
 * @param minutesToIncrement
 */
TimeFactory.increment = function(time, minutesToIncrement = 1) {
    const newTime = moment(time, format).add(minutesToIncrement, 'minutes').format(format);
    return TimeFactory.validate(newTime) ? newTime : undefined;
};

/**
 * Validates whether hour is valid in H form - must be in range [0,23]
 * @param {number} hour
 * @returns {boolean}
 * @private
 */
TimeFactory._validateHour = function(hour) {
    return isNumber(hour) && hour >= 0 && hour < 24;
};

/**
 * Returns true if the given time is in a valid format TimeFactory recognizes
 * @param time
 * @returns {boolean}
 */
TimeFactory.validate = function(time) {
    return moment(time, format, true).isValid();
};

module.exports = TimeFactory;


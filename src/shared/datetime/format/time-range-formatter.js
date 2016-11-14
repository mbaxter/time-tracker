"use strict";
const moment = require('moment');

const TimeRangeFormatter = {};

/**
 * Get the number of minutes between 2 iso datetime string
 * @param {string} startDateTime An iso string
 * @param {string} endDateTime An ISO datetime string
 */
TimeRangeFormatter.getRangeInMinutes = function(startDateTime, endDateTime) {
    const start = moment(startDateTime);
    const end = moment(endDateTime);
    return Math.abs(end.diff(start, 'minutes'));
};

/**
 * Get the hours and minutes between 2 iso datetime strings
 * @param {string} startDateTime An iso string
 * @param {string} endDateTime An ISO datetime string
 */
TimeRangeFormatter.getRangeInHoursAndMinutes = function(startDateTime, endDateTime) {
    let minutes = TimeRangeFormatter.getRangeInMinutes(startDateTime, endDateTime);
    let hours = Math.floor(minutes / 60);
    minutes = minutes - (hours * 60);
    return {minutes, hours};
};

/**
 * Get the hours and minutes between 2 iso datetime strings
 * @param {string} startDateTime An iso string
 * @param {string} endDateTime An ISO datetime string
 */
TimeRangeFormatter.getRangeForDisplay = function(startDateTime, endDateTime) {
    let range = TimeRangeFormatter.getRangeInHoursAndMinutes(startDateTime, endDateTime);
    const hourUnit = range.hours == 1 ? 'hr' : 'hr';
    const minuteUnit = range.minutes == 1 ? 'min' : 'min';
    const includeHours = range.hours > 0;
    const includeMinutes = !includeHours || range.minutes > 0;

    let displayRange = "";
    if (includeHours) {
        displayRange += `${range.hours} ${hourUnit}`;
    }
    if (includeMinutes) {
        if (displayRange) {
            displayRange += ", ";
        }
        displayRange += `${range.minutes} ${minuteUnit}`;
    }

    return displayRange;
};

module.exports = TimeRangeFormatter;
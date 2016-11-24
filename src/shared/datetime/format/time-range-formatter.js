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
    return TimeRangeFormatter.minutesToHoursAndMinutes(minutes);
};

/**
 * Get the hours and minutes between 2 iso datetime strings
 * @param {string} startDateTime An iso string
 * @param {string} endDateTime An ISO datetime string
 */
TimeRangeFormatter.getRangeForDisplay = function(startDateTime, endDateTime) {
    let minutes = TimeRangeFormatter.getRangeInMinutes(startDateTime, endDateTime);
    return TimeRangeFormatter.formatMinutesForDisplay(minutes);
};

TimeRangeFormatter.minutesToHoursAndMinutes = function(minutes) {
    let hours = Math.floor(minutes / 60);
    minutes = minutes - (hours * 60);
    return {minutes, hours};
};

TimeRangeFormatter.formatMinutesForDisplay = function(mins) {
    let {hours, minutes} = TimeRangeFormatter.minutesToHoursAndMinutes(mins);
    const hourUnit = hours == 1 ? 'hr' : 'hr';
    const minuteUnit = minutes == 1 ? 'min' : 'min';
    const includeHours = hours > 0;
    const includeMinutes = !includeHours || minutes > 0;

    let displayRange = "";
    if (includeHours) {
        displayRange += `${hours} ${hourUnit}`;
    }
    if (includeMinutes) {
        if (displayRange) {
            displayRange += ", ";
        }
        displayRange += `${minutes} ${minuteUnit}`;
    }

    return displayRange;
};

module.exports = TimeRangeFormatter;
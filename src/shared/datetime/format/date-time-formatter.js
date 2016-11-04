/**
 * DateTimeFormatter handles transforming datetime data from server-side ISO string to a display-friendly format
 * Also handles taking in date & time data in various formats and normalizing to an ISO string
 */
"use strict";

const moment = require('moment');
require('moment-timezone');
const TimeFormatter = require('./time-formatter');
const DateFormatter = require('./date-formatter');

const DateTimeFormatter = {};
DateTimeFormatter.Time = TimeFormatter;
DateTimeFormatter.Date = DateFormatter;
DateTimeFormatter.dateTimeFormat = `${DateFormatter.internalFormat}T${TimeFormatter.internalFormat}`;
DateTimeFormatter.internalFormat = `${DateTimeFormatter.dateTimeFormat}Z`;
// Regex for splitting internal ISO string format into date, time, UTC offset components
DateTimeFormatter.splitRegex = /(\d{4}-\d\d-\d\d)T(\d\d:\d\d:\d\d)([+-]\d\d:\d\d)/;

/**
 * Formats a normalized ISO string into date & time components for display
 * @param {string} value A normalized ISO datetime string
 * @param {string} timezone The user's timezone - see moment.tz.names()
 * @param {boolean} includeYearForDate - Whether to format the date component with a year
 * @return {Object} Return an object with 'date' and 'time' keys containing formatted strings for display
 */
DateTimeFormatter.parseForDisplay = function(value, timezone, includeYearForDate = false) {
    // Reformat time in user's timezone
    value = moment.tz(value, DateTimeFormatter.internalFormat, true, 'UTC').tz(timezone).format(DateTimeFormatter.internalFormat);
    // Split ISO string into date, time and UTC offset components
    const components = value.match(DateTimeFormatter.splitRegex);
    if(!components || components.length < 3 || !moment.tz.zone(timezone)) {
        return {};
    }

    return {
        date: DateFormatter.formatForDisplay(components[1], includeYearForDate),
        time: TimeFormatter.formatForDisplay(components[2])
    };
};

/**
 * Normalize and combine date and time input to a single ISO string in UTC+0 time
 * @param {string} date A date string in various possible formats
 * @param {string} time A time string in various possible formats
 * @param {string} timezone The user's timezone. See moment-timezone.tz.names()
 * @return {string} ISO datetime string in UTC+0 tz
 */
DateTimeFormatter.normalize = function(date, time, timezone) {
    if (!moment.tz.zone(timezone)) {
        return "Invalid date";
    }

    date = DateFormatter.normalize(date);
    time = TimeFormatter.normalize(time);
    return moment.tz(`${date}T${time}`, DateTimeFormatter.dateTimeFormat, true, timezone).tz('UTC').format(DateTimeFormatter.internalFormat);
};

/**
 * Transform a javascript date object to a normalized ISO string in UTC+0 time
 * @param {Date} date
 * @return {string} ISO datetime string in UTC+0 tz
 */
DateTimeFormatter.normalizeDate = function(date) {
    return moment.tz(date, 'UTC').format(DateTimeFormatter.internalFormat);
};

/**
 *
 * @param {string} value
 * @returns {*}
 */
DateTimeFormatter.isValidNormalizedValue = function(value) {
    return moment(value, DateTimeFormatter.internalFormat, true).isValid();
};

module.exports = DateTimeFormatter;
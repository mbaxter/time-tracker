"use strict";
const moment = require('moment');
const TimeFormatter = {};

// e.g. 1:30 pm
TimeFormatter.displayFormat = "h:mm a";
// e.g. 13:30:00
TimeFormatter.internalFormat = "HH:mm:ss";
// Accept a wide variety of input
TimeFormatter.inputFormats = [
    'H:mm',
    'HH:mm',
    'hh:mm a',
    'hh:mm A',
    'HH:mm:ss',
    'hh:mm:ss a',
    'hh:mm:ss A',
    'H:mm',
    'h:mm a',
    'h:mm A',
    'H:mm:ss',
    'h:mm:ss a',
    'h:mm:ss A',
];

/**
 *
 * @param {string} input
 * @returns {string}
 */
TimeFormatter.normalize = function(input) {
    return moment(input, TimeFormatter.inputFormats, true).format(TimeFormatter.internalFormat);
};

TimeFormatter.formatForDisplay = function(normalizedTime) {
    return moment(normalizedTime, TimeFormatter.internalFormat, true).format(TimeFormatter.displayFormat);
};

module.exports = TimeFormatter;
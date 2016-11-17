"use strict";
const moment = require('moment');
const stringPermutations = require('../../util/string/permutations');
const TimeFormatter = {};

// e.g. 1:30 pm
TimeFormatter.displayFormat = "h:mm a";
// e.g. 13:30:00
TimeFormatter.internalFormat = "HH:mm:ss";

// Accept a wide variety of input
TimeFormatter.inputFormats = [... stringPermutations(
    // Variations of 24-hr time
    [['H','HH'], ':mm', [':ss','']],
    // Variations of 12-hr time
    [['h','hh'], ':mm', [':ss',''], ['', ' '], ['a', 'A']]
)];

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
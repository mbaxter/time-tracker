"use strict";
const moment = require('moment');
const stringPermutations = require('../../string/permutations');

const DateFormatter = {};

// e.g. Wed, Oct 26
DateFormatter.displayFormat = "ddd, MMM D";
// e.g. Wed, Oct 26 2016
DateFormatter.displayFormatFull = "ddd, MMM D YYYY";

DateFormatter.internalFormat = "YYYY-MM-DD";
// Accept a wide variety of input
DateFormatter.inputFormats = [... stringPermutations(
        // Variations on 2016-02-02 format
        [['YYYY','YY'], '/', ['MM','M'], '/', ['DD','D']],
        [['YYYY','YY'], '-', ['MM','M'], '-', ['DD','D']],
        [['YYYY','YY'], ' ', ['MM','M'], ' ', ['DD','D']],
        [['YYYY','YY'], 'MMDD'],
        // Variations on Feb 2, 2016 format
        [['MMMM','MMM'],' ',['DD','D'], [', ', ' '], ['YYYY', 'YY', '\'YY']]
)];

DateFormatter.normalize = function(input) {
    return moment(input, DateFormatter.inputFormats, true).format(DateFormatter.internalFormat);
};

DateFormatter.formatForDisplay = function(normalizedDate, includeYear = false) {
    const format = includeYear ? DateFormatter.displayFormatFull : DateFormatter.displayFormat;
    return moment(normalizedDate, DateFormatter.internalFormat, true).format(format);
};

module.exports = DateFormatter;
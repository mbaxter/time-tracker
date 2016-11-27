"use strict";
const moment = require('moment');
const stringPermutations = require('../../util/string/permutations');

const DateFormatter = {};

// e.g. Wed, Oct 26
DateFormatter.displayFormat = "ddd, MMM D";
// e.g. Wed, Oct 26 2016
DateFormatter.displayFormatFull = "ddd, MMM D YYYY";
DateFormatter.smallDisplayFormat = "MMM D";

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
    return DateFormatter._toMoment(input, DateFormatter.inputFormats).format(DateFormatter.internalFormat);
};

DateFormatter.toNativeDate = function(normalizedDate) {
    let dateComponents = normalizedDate.split('-');
    if (dateComponents.length != 3) {
        return null;
    }
    return new Date(dateComponents[0], dateComponents[1] - 1, dateComponents[2]);
};

DateFormatter.formatForDisplay = function(normalizedDate, includeYear = false) {
    const format = includeYear ? DateFormatter.displayFormatFull : DateFormatter.displayFormat;
    return DateFormatter._toMoment(normalizedDate, DateFormatter.internalFormat).format(format);
};

DateFormatter.formatForSmallDisplay = function(normalizedDate) {
    return DateFormatter._toMoment(normalizedDate, DateFormatter.internalFormat).format(DateFormatter.smallDisplayFormat);
};

DateFormatter.isValidNormalizedValue = function(value) {
    return moment(value, DateFormatter.internalFormat, true).isValid();
};

DateFormatter._toMoment = function(value, inputFormat) {
    return (value instanceof Date) ? moment(value) : moment(value, inputFormat, true);
};

module.exports = DateFormatter;
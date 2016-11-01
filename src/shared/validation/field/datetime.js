"use strict";
const DateTimeFormatter = require('../../datetime/format/date-time-formatter');

module.exports.create = function() {
    return (val) => {
       return DateTimeFormatter.isValidNormalizedValue(val);
    };
};
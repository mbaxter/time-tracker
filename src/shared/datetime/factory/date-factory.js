/**
 * A Utility for creating dates in YYYY-MM-DD format
 */
"use strict";
const moment = require('moment');

const DateFactory = {};
const format = "YYYY-MM-DD";

DateFactory.today = function() {
    return moment().format(format);
};

DateFactory.increment = function(date, days) {
    const newDate = moment(date, format).add(days, 'days').format(format);
    return DateFactory.validate(newDate) ? newDate : undefined;
};

DateFactory.validate = function(date) {
    return moment(date, format, true).isValid();
};

module.exports = DateFactory;
"use strict";
const moment = require('moment');

const NativeDateFactory = {};

NativeDateFactory.incrementByHours = function(date, hours = 1) {
    let mDate = moment(NativeDateFactory.clone(date));
    return mDate.add(hours, 'hours').toDate();
};

NativeDateFactory.incrementByDays = function(date, days = 1) {
    let mDate = moment(NativeDateFactory.clone(date));
    return mDate.add(days, 'days').toDate();
};

NativeDateFactory.clone = function(date) {
    if (!(date instanceof Date)) {
        return null;
    }
    return new Date(date.toString());
};

NativeDateFactory.average = function(a, b) {
    let diff = b.getTime() - a.getTime();
    return moment(a).add(Math.round(diff/2000), 'seconds').toDate();
};

module.exports = NativeDateFactory;
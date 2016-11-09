"use strict";
const moment = require('moment');
require('moment-timezone');

module.exports.create = function() {
    return (val) => {
        let stringVal = val || "";
        stringVal = String(stringVal);
        return moment.tz.zone(stringVal) != null;
    };
};
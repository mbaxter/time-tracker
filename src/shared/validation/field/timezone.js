"use strict";
const moment = require('moment');
require('moment-timezone');

module.exports.create = function() {
    return (val) => {
        return moment.tz.zone(val) != null;
    };
};
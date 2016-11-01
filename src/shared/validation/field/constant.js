"use strict";
const values = require('lodash/values');

module.exports.create = function(constantObj) {
    return (val) => {
       return values(constantObj).indexOf(val) >= 0;
    };
};
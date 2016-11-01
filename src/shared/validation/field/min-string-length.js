"use strict";
const isString = require('lodash/isString');

module.exports.create = function(min) {
    return (val) => {
       return isString(val) && val.length >= min;
    };
};
"use strict";
const isInteger = require('lodash/isInteger');

module.exports.create = function() {
    return (val) => {
        const parsedVal = parseInt(val, 10);
        return isInteger(parsedVal) && parsedVal == val;
    };
};
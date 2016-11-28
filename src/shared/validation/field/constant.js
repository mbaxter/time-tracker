"use strict";
const values = require('lodash/values');
const findIndex = require('lodash/findIndex');

module.exports.create = function(constantObj) {
    return (val) => {
       return findIndex(values(constantObj), (constVal) => constVal == val) >= 0;
    };
};
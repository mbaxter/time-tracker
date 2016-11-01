"use strict";
const isString = require('lodash/isString');
const emailValidator = require('email-validator');

module.exports.create = function() {
    return (val) => isString(val) && emailValidator.validate(val);
};
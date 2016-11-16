"use strict";
const Redux = require('redux');

const fields = require('./fields');
const submissions = require('./submissions');

module.exports = Redux.combineReducers({
    fields,
    submissions
});

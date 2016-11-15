"use strict";
const Redux = require('redux');
const batchPull = require('./batch-pull');
const formSubmissions = require('./form-submissions');
const singleton = require('./singleton');

module.exports = module.exports = Redux.combineReducers({
    batchPull,
    formSubmissions,
    singleton
});
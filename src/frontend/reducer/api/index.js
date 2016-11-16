"use strict";
const Redux = require('redux');
const batchPull = require('./batch-pull');
const request = require('./request');

module.exports = module.exports = Redux.combineReducers({
    batchPull,
    request
});
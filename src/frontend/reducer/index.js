"use strict";
const Redux = require('redux');
const credentials = require('./credentials');
const ui = require('./ui');
const request = require('./request');
const records = require('./records');

module.exports = Redux.combineReducers({
    credentials,
    records,
    request,
    ui
});
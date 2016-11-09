"use strict";
const Redux = require('redux');
const credentials = require('./credentials');
const ui = require('./ui');
const request = require('./request');

module.exports = Redux.combineReducers({
    credentials: credentials,
    request: request,
    ui: ui
});
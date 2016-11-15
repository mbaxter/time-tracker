"use strict";
const Redux = require('redux');
const batchPull = require('./batch-pull');
const credentials = require('./credentials');
const ui = require('./ui');
const request = require('./request');
const pendingRequests = require('./pending-requests');
const records = require('./records');

module.exports = Redux.combineReducers({
    batchPull,
    credentials,
    pendingRequests,
    records,
    request,
    ui
});
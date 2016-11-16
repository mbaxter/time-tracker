"use strict";
const Redux = require('redux');
const api = require('./api');
const credentials = require('./credentials');
const datatable = require('./datatable');
const form = require('./form');
const global = require('./global');
const records = require('./records');

module.exports = Redux.combineReducers({
    api,
    credentials,
    datatable,
    form,
    global,
    records
});
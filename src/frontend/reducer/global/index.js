"use strict";
const Redux = require('redux');

const alerts = require('./alerts');
const loader = require('./loader');

module.exports = Redux.combineReducers({
    alerts,
    loader
});

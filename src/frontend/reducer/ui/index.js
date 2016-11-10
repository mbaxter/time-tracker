"use strict";
const Redux = require('redux');

const alerts = require('./alerts');
const formFields = require('./form-fields');
const loader = require('./loader');

module.exports = Redux.combineReducers({
    alerts,
    formFields,
    loader
});

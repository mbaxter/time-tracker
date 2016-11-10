"use strict";
const Redux = require('redux');

const formFields = require('./form-fields');
const loader = require('./loader');

module.exports = Redux.combineReducers({
    formFields,
    loader
});

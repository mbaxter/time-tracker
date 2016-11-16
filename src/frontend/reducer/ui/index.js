"use strict";
const Redux = require('redux');

const alerts = require('./alerts');
const formFields = require('./form-fields');
const loader = require('./loader');
const paging = require('./paging');

module.exports = Redux.combineReducers({
    alerts,
    formFields,
    loader,
    paging
});

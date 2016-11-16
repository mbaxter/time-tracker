"use strict";
const Redux = require('redux');

const filter = require('./filter');
const paging = require('./paging');

module.exports = Redux.combineReducers({
    filter,
    paging
});

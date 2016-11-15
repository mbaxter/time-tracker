"use strict";
const reselect = require('reselect');
const inputSelectors = require('./input-selectors');
const orderBy = require('lodash/orderBy');
const values = require('lodash/values');

module.exports = reselect.createSelector(
    inputSelectors.timeBlocks,
    (alerts) => {
        return orderBy(values(alerts), 'start', 'desc');
    }
);
"use strict";
const reselect = require('reselect');
const subjectSelectors = require('./subject-selector');
const orderBy = require('lodash/orderBy');
const values = require('lodash/values');

module.exports = reselect.createSelector(
    subjectSelectors.timeBlocks,
    (alerts) => {
        return orderBy(values(alerts), 'start', 'desc');
    }
);
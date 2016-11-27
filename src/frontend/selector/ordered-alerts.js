"use strict";
const createSelector = require('../util/createSelector');
const subjectSelectors = require('./subject-selector');
const orderBy = require('lodash/orderBy');
const values = require('lodash/values');

module.exports = createSelector(
    subjectSelectors.alerts,
    (alerts) => {
        return orderBy(values(alerts), 'created', 'desc');
    }
);
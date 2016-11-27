"use strict";
const createSelector = require('../../util/createSelector');
const subjectSelectors = require('./../subject-selector/index');
const orderBy = require('lodash/orderBy');
const values = require('lodash/values');

module.exports = createSelector(
    subjectSelectors.users,
    (users) => {
        return orderBy(values(users), ['last_name', 'first_name', 'email_address']);
    }
);
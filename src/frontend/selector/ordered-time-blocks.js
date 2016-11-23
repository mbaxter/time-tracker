"use strict";
const reselect = require('reselect');
const subjectSelectors = require('./subject-selector');
const orderBy = require('lodash/orderBy');
const values = require('lodash/values');

module.exports = reselect.createSelector(
    subjectSelectors.currentUserId,
    subjectSelectors.timeBlocks,
    (userId, timeBlocks) => {
        return orderBy(values(timeBlocks).filter((record) => record.user_id == userId), 'start', 'desc');
    }
);
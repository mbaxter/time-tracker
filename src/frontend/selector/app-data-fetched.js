"use strict";
const reselect = require('reselect');
const subjectSelectors = require('./subject-selector');
const RecordTypes = require('../constants/record-types');

module.exports = reselect.createSelector(
    subjectSelectors.currentUser,
    subjectSelectors.batchPull(RecordTypes.TIME_BLOCK),
    (currentUser, batchPull) => {
        return currentUser && batchPull.finished;
    }
);
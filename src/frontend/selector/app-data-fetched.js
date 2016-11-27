"use strict";
const createSelector = require('../util/createSelector');
const subjectSelectors = require('./subject-selector');
const RecordTypes = require('../constants/record-types');

module.exports = createSelector(
    subjectSelectors.currentUser,
    subjectSelectors.batchPull(RecordTypes.TIME_BLOCK),
    (currentUser, batchPull) => {
        return currentUser && batchPull.finished;
    }
);
"use strict";
const createSelector = require('../util/createSelector');
const subjectSelectors = require('./subject-selector');
const RecordTypes = require('../constants/record-types');
const UserRole = require('../../shared/constants/user-role');

module.exports = createSelector(
    subjectSelectors.currentUser,
    subjectSelectors.batchPull(RecordTypes.TIME_BLOCK),
    subjectSelectors.batchPull(RecordTypes.USER),
    (currentUser, timeBlockBatchPull, userBatchPull) => {
        return currentUser && timeBlockBatchPull.finished &&
            // Admin users required user data to be pulled
            (currentUser.role != UserRole.ADMIN || userBatchPull.finished);
    }
);
"use strict";
const createSelector = require('../../util/createSelector');
const subject = require('../subject-selector');

module.exports = (initialState) => {
   const initialClearCount = subject.clearedCredentialsCount(initialState);
    return createSelector(
        subject.clearedCredentialsCount,
        (currentCount) => {
            return currentCount > initialClearCount;
        }
    );
};
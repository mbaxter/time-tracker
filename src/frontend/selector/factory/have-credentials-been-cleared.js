"use strict";
const reselect = require('reselect');
const subject = require('../subject-selector');

module.exports = (initialState) => {
   const initialClearCount = subject.clearedCredentialsCount(initialState);
    return reselect.createSelector(
        subject.clearedCredentialsCount,
        (currentCount) => {
            return currentCount > initialClearCount;
        }
    );
};
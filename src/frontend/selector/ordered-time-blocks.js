"use strict";
const createSelector = require('../util/createSelector');
const subjectSelectors = require('./subject-selector');
const orderBy = require('lodash/orderBy');
const values = require('lodash/values');
const DateTimeFormatter = require('../../shared/datetime/format/date-time-formatter');
const clone = require('lodash/clone');

module.exports = createSelector(
    subjectSelectors.currentUserId,
    subjectSelectors.timezone,
    subjectSelectors.timeBlocks,
    (userId, timezone, timeBlocks) => {
        return orderBy(values(timeBlocks).filter((record) => record.user_id == userId), 'start', 'desc')
            .map((timeBlock) => {
                timeBlock = clone(timeBlock);
                timeBlock.startDateTime = DateTimeFormatter.parse(timeBlock.start, timezone);
                return timeBlock;
            });
    }
);
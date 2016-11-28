"use strict";
const createSelector = require('../../util/createSelector');
const timeBlockDataset = require('./dataset');
const first = require('lodash/first');
const last = require('lodash/last');
const RecordTypes = require('../../constants/record-types');
const TimeRangeFormatter = require('../../../shared/datetime/format/time-range-formatter');
const DateFactory = require('../../../shared/datetime/factory/date-factory');
const subjectSelectors = require('./../subject-selector/index');
const get = require('lodash/get');

module.exports = createSelector(
    timeBlockDataset,
    subjectSelectors.dateFilterValue(RecordTypes.TIME_BLOCK),
    (timeBlocks, filter = {}) => {
        if (filter.to && filter.from) {
            return {
                min: filter.from,
                max: filter.to
            };
        }

        let {date: maxDate} = get(first(timeBlocks), 'startDateTime', {});
        let {date: minDate} = get(last(timeBlocks), 'startDateTime',{});

        // If we only have a small amount of data, extend the range
        let minBreadth = 6;
        let breadth = TimeRangeFormatter.getRangeInDays(minDate, maxDate);
        if (breadth < minBreadth) {
            minDate = DateFactory.increment(maxDate, -minBreadth);
        }

        return {
            min: minDate,
            max: maxDate
        };
    }
);

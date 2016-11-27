"use strict";
const createSelector = require('../../util/createSelector');
const timeBlockDataset = require('./dataset');
const first = require('lodash/first');
const last = require('lodash/last');
const RecordTypes = require('../../constants/record-types');
const DateTimeFormatter = require('../../../shared/datetime/format/date-time-formatter');
const subjectSelectors = require('./../subject-selector/index');
const get = require('lodash/get');

module.exports = createSelector(
    timeBlockDataset,
    subjectSelectors.dateFilterValue(RecordTypes.TIME_BLOCK),
    subjectSelectors.timezone,
    (timeBlocks, filter = {}, timezone) => {
        if (filter.to && filter.from) {
            return {
                min: filter.from,
                max: filter.to
            };
        }

        let maxTimeBlock = DateTimeFormatter.parse(get(first(timeBlocks), 'start', ''), timezone);
        let minTimeBlock = DateTimeFormatter.parse(get(last(timeBlocks), 'start',''), timezone);

        return {
            min: minTimeBlock.date,
            max: maxTimeBlock.date
        };
    }
);

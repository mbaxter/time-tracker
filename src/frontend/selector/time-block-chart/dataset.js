"use strict";
const createSelector = require('../../util/createSelector');
const RecordTypes = require('../../constants/record-types');
const orderedTimeBlocks = require("./../ordered-time-blocks");
const subjectSelectors = require('./../subject-selector/index');

module.exports = createSelector(
    orderedTimeBlocks,
    subjectSelectors.dateFilterValue(RecordTypes.TIME_BLOCK),
    (orderedTimeBlocks, dateFilter) => {
        // If there's no filter, just return the ordered array
        if (!dateFilter.from || !dateFilter.to) {
            return orderedTimeBlocks;
        }

        // Otherwise, filter by date
        return orderedTimeBlocks.filter((timeBlock) => {
            const inRange = (val) => {
                let date = val.substring(0, val.indexOf('T'));
                return date >= dateFilter.from && date <= dateFilter.to;
            };

            return inRange(timeBlock.start) || inRange(timeBlock.end);
        });
    }
);
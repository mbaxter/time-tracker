"use strict";
const reselect = require('reselect');
const RecordTypes = require('../constants/record-types');
const orderedTimeBlocks = require("./ordered-time-blocks");
const subjectSelectors = require('./subject-selector');

module.exports = reselect.createSelector(
    orderedTimeBlocks,
    subjectSelectors.dateFilter(RecordTypes.TIME_BLOCK),
    (orderedTimeBlocks, dateFilter) => {
        // If there's no filter, just return the ordered array
        if (!dateFilter.filter.from || !dateFilter.filter.to) {
            return orderedTimeBlocks;
        }

        // Otherwise, filter by date
        return orderedTimeBlocks.filter((timeBlock) => {
            const inRange = (val) => {
                let date = val.substring(0, val.indexOf('T'));
                return date >= dateFilter.filter.from && date <= dateFilter.filter.to;
            };

            return inRange(timeBlock.start) || inRange(timeBlock.end);
        });
    }
);
"use strict";
const createSelector = require('../../util/createSelector');
const barChartRange = require('./bar-chart-range');
const d3Time = require('d3-time');
const TimeRangeFormatter = require('../../../shared/datetime/format/time-range-formatter');
const DateFormatter = require('../../../shared/datetime/format/date-formatter');
const moment = require('moment');

module.exports = createSelector(
    barChartRange,
    (barChartRange) => {
        let {min = 0, max = 0} = barChartRange;
        if (!min && !max) {
            return [];
        }

        // Setup bucket size based on range of data
        let breadth = TimeRangeFormatter.getRangeInDays(min, max);
        let interval, label;
        if (breadth < 70) {
            // Days
            interval = d3Time.timeDay;
            label = DateFormatter.formatForSmallDisplay;
        } else if (breadth < 365) {
            // Weeks
            interval = d3Time.timeWeek;
            label = (date) => {
                let minRange = interval.floor(date);
                let maxRange = interval.offset(minRange,1);
                // Roll upper range back by one second
                maxRange.setSeconds(maxRange.getSeconds() - 1);
                let minFormat = 'MMM D';
                let maxFormat = (minRange.getMonth() == maxRange.getMonth()) ? 'D' : minFormat;
                return `${moment(minRange).format(minFormat)} - ${moment(maxRange).format(maxFormat)}`;
            };
        } else {
            // Months
            interval = d3Time.timeMonth;
            label = (date) => moment(date).format('MMMM');
        }

        // Define min (inclusive) and max (exclusive) bounds for our date range
        let minDate = DateFormatter.toNativeDate(min);
        let maxDate = d3Time.timeDay.offset(DateFormatter.toNativeDate(max));

        return interval.range(interval.floor(minDate), interval.ceil(maxDate)).map((date) => {
            let min = interval.floor(date);
            let max = interval.offset(min);
            // Roll upper bound back by one second so buckets are distinct
            max.setSeconds(max.getSeconds() - 1);
            return {
                min,
                max,
                label: label(date)
            };
        });
    }
);

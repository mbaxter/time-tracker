"use strict";
const reselect = require('reselect');
const RecordTypes = require('../constants/record-types');
const subjectSelectors = require('./subject-selector');
const timeBlockTableData = require('./time-block-table-data');
const DateTimeFormatter = require('../../shared/datetime/format/date-time-formatter');
const NativeDateFactory = require('../../shared/datetime/factory/native-date-factory');
const TimeRangeFormatter = require('../../shared/datetime/format/time-range-formatter');
const isUndefined = require('lodash/isUndefined');
const d3Scale = require('d3-scale');
const d3Time = require('d3-time');
const map = require('lodash/map');
const sortBy = require('lodash/sortBy');

/**
 * Accumulates time block data into buckets by day
 */
module.exports = reselect.createSelector(
    timeBlockTableData,
    subjectSelectors.dateFilterValue(RecordTypes.TIME_BLOCK),
    subjectSelectors.timezone,
    (timeBlockTableData, dateFilter, timezone) => {
        // Group data into buckets
        const dateBuckets = {};
        timeBlockTableData.forEach((timeBlock) => {
            const startDateTime = DateTimeFormatter.parse(timeBlock.start, timezone);
            const date = startDateTime.date;
            const timeRange = TimeRangeFormatter.getRangeInMinutes(timeBlock.start, timeBlock.end);
            if (isUndefined(dateBuckets[date])) {
                dateBuckets[date] = 0;
            }
            dateBuckets[date] += timeRange;
        });

        // Convert bucketed data into an array and calculate x and y ranges
        let xMin = false;
        let xMax = false;
        let yMax = 0;
        let buckets = map(dateBuckets, (totalTime, date) => {
            if (totalTime > yMax) {
                yMax = totalTime;
            }

            xMin = (!xMin || date < xMin) ? date : xMin;
            xMax = (!xMax || date > xMax) ? date : xMax;

            let nativeDate = DateTimeFormatter.Date.toNativeDate(date);
            return {
                x: nativeDate,
                y: totalTime,
                // We're calculating bar data, so x is a range
                xRange: [
                    nativeDate,
                    NativeDateFactory.incrementByDays(nativeDate, 1)
                ]
            };
        });

        // If the filter is active, filter dates should override range of the data
        if (dateFilter.from && dateFilter.to) {
            xMin = dateFilter.from;
            xMax = dateFilter.to;
        }

        let xRange = [
            DateTimeFormatter.Date.toNativeDate(xMin),
            // Extend range by one day so that the last day of data will be displayed
            NativeDateFactory.incrementByDays(
                DateTimeFormatter.Date.toNativeDate(xMax)
            )
        ];

        return {
            xScale: d3Scale.scaleTime().domain(xRange),
            yScale: d3Scale.scaleLinear().domain([0, yMax]),
            data: sortBy(buckets, 'x[0]'),
            xTicks: d3Time.timeDay.range(... xRange).map((date) => {
                return {
                    value: NativeDateFactory.incrementByHours(date, 12),
                    display: DateTimeFormatter.Date.formatForSmallDisplay(date)
                };
            })
        };
    }
);
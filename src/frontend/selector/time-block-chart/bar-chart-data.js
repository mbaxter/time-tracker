"use strict";
const createSelector = require('../../util/createSelector');
const subjectSelectors = require('./../subject-selector/index');
const dataset = require('./dataset');
const buckets = require('./bar-chart-buckets');
const DateTimeFormatter = require('../../../shared/datetime/format/date-time-formatter');
const NativeDateFactory = require('../../../shared/datetime/factory/native-date-factory');
const TimeRangeFormatter = require('../../../shared/datetime/format/time-range-formatter');
const d3Scale = require('d3-scale');
const binarySearch = require('binary-search');
let first = require('lodash/first');
let last = require('lodash/last');

/**
 * Accumulates time block data into buckets by day
 */
module.exports = createSelector(
    dataset,
    buckets,
    subjectSelectors.timezone,
    (dataset, buckets, timezone) => {
        let bucketedData = buckets.map((bucket) => {
            return {
                label: bucket.label,
                xRange: [
                    bucket.min,
                    bucket.max
                ],
                y: 0
            };
        });

        // Calculate y values for bucketData
        const comparator = (a,b) => {
            let sortVal = 0;
           if (a.xRange[0] >= b.xRange[0] && a.xRange[1] <= b.xRange[1] ||
               b.xRange[0] >= a.xRange[0] && b.xRange[1] <= a.xRange[1]
           ) {
               // We've found our target - one range is contained within the other
               sortVal = 0;
           } else if (a.xRange[1] < b.xRange[0]) {
               sortVal = -1;
           } else {
               sortVal = 1;
           }
           return sortVal;
        };

        let maxTimeRange = 0;
        let bucketIndex = buckets.length - 1;
        dataset.forEach((timeBlock) => {
            const startDateTime = DateTimeFormatter.parse(timeBlock.start, timezone);
            const date = DateTimeFormatter.Date.toNativeDate(startDateTime.date);
            // Dataset is in descending order, so we know that we can max out the search at the previous bucketIndex
            bucketIndex = binarySearch(bucketedData, {xRange: [date,date]}, comparator, 0, bucketIndex);
            const timeRange = TimeRangeFormatter.getRangeInMinutes(timeBlock.start, timeBlock.end);
            bucketedData[bucketIndex].y += timeRange;
            maxTimeRange = bucketedData[bucketIndex].y > maxTimeRange ? bucketedData[bucketIndex].y : maxTimeRange;
        });

        let xRange = [];
        let boundingBuckets = [first(buckets), last(buckets)];
        xRange[0] = boundingBuckets[0] ? boundingBuckets[0].min : 0;
        xRange[1] = boundingBuckets[1] ? boundingBuckets[1].max : 0;
        return {
            xScale: d3Scale.scaleTime().domain(xRange),
            yScale: d3Scale.scaleLinear().domain([0, maxTimeRange]),
            data: bucketedData,
            xTicks: buckets.map((bucket) => {
                return {
                    value: NativeDateFactory.average(bucket.min, bucket.max),
                    label: bucket.label
                };
            })
        };
    }
);
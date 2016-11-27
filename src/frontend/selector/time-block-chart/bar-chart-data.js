"use strict";
const createSelector = require('../../util/createSelector');
const subjectSelectors = require('./../subject-selector/index');
const dataset = require('./dataset');
const buckets = require('./bar-chart-buckets');
const DateTimeFormatter = require('../../../shared/datetime/format/date-time-formatter');
const NativeDateFactory = require('../../../shared/datetime/factory/native-date-factory');
const TimeRangeFormatter = require('../../../shared/datetime/format/time-range-formatter');
const d3Scale = require('d3-scale');
let isUndefined = require('lodash/isUndefined');
let first = require('lodash/first');
let last = require('lodash/last');

/**
 * Accumulates time block data into buckets by day
 */
module.exports = createSelector(
    dataset,
    buckets,
    subjectSelectors.timezone,
    (dataset, {buckets = [], dateToBucket}, timezone) => {
        // Collect totals for each bucket
        let maxTotal = 0;
        let bucketTotals = {};
        dataset.forEach((timeBlock) => {
            const startDateTime = DateTimeFormatter.parse(timeBlock.start, timezone);
            const date = DateTimeFormatter.Date.toNativeDate(startDateTime.date);
            let bucket = dateToBucket(date);
            if (isUndefined(bucketTotals[bucket])) {
               bucketTotals[bucket] = 0;
            }
            bucketTotals[bucket] += TimeRangeFormatter.getRangeInMinutes(timeBlock.start, timeBlock.end);
            maxTotal = bucketTotals[bucket] > maxTotal ? bucketTotals[bucket] : maxTotal;
        });

        let bucketedData = buckets.map((bucket) => {
            return {
                label: bucket.label,
                xRange: [
                    bucket.min,
                    bucket.max
                ],
                y: bucketTotals[bucket.label] || 0
            };
        });

        let xRange = [];
        let boundingBuckets = [first(buckets), last(buckets)];
        xRange[0] = boundingBuckets[0] ? boundingBuckets[0].min : 0;
        xRange[1] = boundingBuckets[1] ? boundingBuckets[1].max : 0;
        return {
            xScale: d3Scale.scaleTime().domain(xRange),
            yScale: d3Scale.scaleLinear().domain([0, maxTotal]),
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
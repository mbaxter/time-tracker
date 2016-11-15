"use strict";
const get = require('lodash/select');
const curry = require('lodash/curry');
const RecordTypes = require('../../constants/record-types');

const InputSelectors = {};

InputSelectors.alerts = (state) => {
    return get(state, "ui.alerts", {});
};

InputSelectors.records = curry(
    (type, state) => {
        return get(state, `records.${type}`, []);
    }
);

InputSelectors.timeBlocks = InputSelectors.records(RecordTypes.TIME_BLOCK);
InputSelectors.users = InputSelectors.records(RecordTypes.USER);


module.exports = InputSelectors;
"use strict";
const React = require('react');
const ReactRedux = require('react-redux');
const TimeBlockDatatable = require('../presentational/time-block-datatable');
const get = require('lodash/get');
const RecordTypes = require('../../constants/record-types');
const reselect = require('reselect');
const orderBy = require('lodash/orderBy');

const TimeBlockWidget = (props) => {
    return (
        <TimeBlockDatatable {... props}/>
    );
};

const timeBlocksSelector = (state) => {
    return get(state, `records.${RecordTypes.TIME_BLOCK}`, []);
};

const orderedTimeBlocksSelector = reselect.createSelector(
    timeBlocksSelector,
    (timeBlocks) => {
        return orderBy(timeBlocks, 'start');
    }
);

const mapStateToProps = (state) => {
    const data = orderedTimeBlocksSelector(state);
    const userId = get(state, 'credentials.userId');
    const timezone = get(state, `records.${RecordTypes.USER}.${userId}.timezone`, 'UTC');
    return {
        data,
        timezone
    };
};

module.exports = ReactRedux.connect(
    mapStateToProps
)(TimeBlockWidget);
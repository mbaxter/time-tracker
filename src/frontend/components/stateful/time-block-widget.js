"use strict";
const React = require('react');
const ReactRedux = require('react-redux');
const TimeBlockDatatable = require('../presentational/time-block-datatable');
const get = require('lodash/get');
const RecordTypes = require('../../constants/record-types');
const orderedTimeBlocksSelector = require('../../selector/ordered-time-blocks');

const TimeBlockWidget = (props) => {
    return (
        <TimeBlockDatatable {... props}/>
    );
};

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
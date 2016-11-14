"use strict";
const React = require('react');
const ReactRedux = require('react-redux');
const TimeBlockDatatable = require('../presentational/time-block-datatable');
const pick = require('lodash/pick');
const get = require('lodash/get');
const RecordTypes = require('../../constants/record-types');

const TimeBlockWidget = (props) => {
    return (
        <TimeBlockDatatable {... pick(props, ['data','onDelete','onEdit'])}/>
    );
};

const mapStateToProps = (state) => {
    const data = get(state, `records.${RecordTypes.TIME_BLOCK}`, []);
    return {data};
};

module.exports = ReactRedux.connect(
    mapStateToProps
)(TimeBlockWidget);
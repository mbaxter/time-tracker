"use strict";
const React = require('react');
const ReactRedux = require('react-redux');
const TimeBlockDatatable = require('../presentational/time-block-datatable');
const subjectSelector = require('../../selector/subject-selector');
const orderedTimeBlocksSelector = require('../../selector/ordered-time-blocks');

const TimeBlockWidget = (props) => {
    return (
        <TimeBlockDatatable {... props}/>
    );
};

const mapStateToProps = (state) => {
    const data = orderedTimeBlocksSelector(state);
    const {timezone = "UTC"} = subjectSelector.currentUser(state) || {};
    return {
        data,
        timezone
    };
};

module.exports = ReactRedux.connect(
    mapStateToProps
)(TimeBlockWidget);
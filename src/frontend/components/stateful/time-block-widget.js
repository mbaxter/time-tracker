"use strict";
const React = require('react');
const ReactRedux = require('react-redux');
const TimeBlockDatatable = require('../presentational/time-block-datatable');
const subjectSelector = require('../../selector/subject-selector');
const timeBlockDataSelector = require('../../selector/time-block-table-data');
const timeBlockPageSelector = require('../../selector/time-block-table-page');
const RecordTypes = require('../../constants/record-types');
const actions = require('../../actions');

const TimeBlockWidget = (props) => {
    return (
        <TimeBlockDatatable {... props}/>
    );
};

const mapStateToProps = (state) => {
    const {timezone = "UTC"} = subjectSelector.currentUser(state) || {};
    return {
        ... timeBlockPageSelector(state),
        timezone
    };
};

const mapDispatchToProps = (dispatch) => {
    const onGoToPage = (page) => {
        dispatch(actions.goToPage(RecordTypes.TIME_BLOCK, timeBlockDataSelector, page));
    };

    return {
        onGoToPage
    };
};

module.exports = ReactRedux.connect(
    mapStateToProps,
    mapDispatchToProps
)(TimeBlockWidget);
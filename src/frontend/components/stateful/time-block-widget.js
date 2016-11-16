"use strict";
const React = require('react');
const ReactRedux = require('react-redux');
const TimeBlockDatatable = require('../presentational/time-block-datatable');
const subjectSelector = require('../../selector/subject-selector');
const timeBlockDataSelector = require('../../selector/time-block-table-data');
const timeBlockPageSelector = require('../../selector/time-block-table-page');
const RecordTypes = require('../../constants/record-types');
const actions = require('../../actions');
const omit = require('lodash/omit');
const merge = require('lodash/merge');

const TimeBlockWidget = (props) => {
    return (
        <TimeBlockDatatable {... props}/>
    );
};

const mapStateToProps = (state) => {
    const {timezone = "UTC"} = subjectSelector.currentUser(state) || {};
    const {error, fields} = subjectSelector.dateFilter(RecordTypes.TIME_BLOCK, state);
    const timeBlockPage =  timeBlockPageSelector(state);
    return {
        dateFilter: {
            ... fields,
            error
        },
        paging: omit(timeBlockPage, 'data'),
        data: timeBlockPage.data,
        timezone
    };
};

const mapDispatchToProps = (dispatch) => {
    const onGoToPage = (page) => {
        dispatch(actions.goToPage(RecordTypes.TIME_BLOCK, timeBlockDataSelector, page));
    };
    const onDateFilterChange = (fieldName, fieldValue) => {
        dispatch(actions.setDateFilterField(RecordTypes.TIME_BLOCK, fieldName, fieldValue));
    };
    const onDateFilterSubmit = (formData) => {
        dispatch(actions.submitDateFilter(RecordTypes.TIME_BLOCK, formData));
    };
    const onDateFilterClear = () => {
        dispatch(actions.clearDateFilter(RecordTypes.TIME_BLOCK));
    };

    return {
        dateFilter: {
            onChange: onDateFilterChange,
            onSubmit: onDateFilterSubmit,
            onReset: onDateFilterClear
        },
        paging: {onGoToPage}
    };
};

module.exports = ReactRedux.connect(
    mapStateToProps,
    mapDispatchToProps,
    merge
)(TimeBlockWidget);
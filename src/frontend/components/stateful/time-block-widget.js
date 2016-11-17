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
    const onCreate = () => {
        dispatch(actions.async.navigateToPage(`/app/time-blocks/create`));
    };
    const onEdit = (row) => {
        dispatch(actions.async.navigateToPage(`/app/time-blocks/edit/${row.id}`));
    };

    const onGoToPage = (page) => {
        dispatch(actions.async.goToDatatablePage(RecordTypes.TIME_BLOCK, timeBlockDataSelector, page));
    };
    const onDateFilterChange = (fieldName, fieldValue) => {
        dispatch(actions.sync.setDateFilterField(RecordTypes.TIME_BLOCK, fieldName, fieldValue));
    };
    const onDateFilterSubmit = (formData) => {
        dispatch(actions.async.submitDateFilter(RecordTypes.TIME_BLOCK, formData));
    };
    const onDateFilterClear = () => {
        dispatch(actions.sync.clearDateFilter(RecordTypes.TIME_BLOCK));
    };

    return {
        onCreate,
        onEdit,
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
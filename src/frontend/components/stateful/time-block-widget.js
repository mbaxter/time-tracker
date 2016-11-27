"use strict";
const React = require('react');
const ReactRedux = require('react-redux');
const TimeBlockChart = require('../presentational/time-block-chart');
const subjectSelector = require('../../selector/subject-selector');
const datasetSelector = require('../../selector/time-block-chart/dataset');
const tablePageSelector = require('../../selector/time-block-chart/table-page');
const barChartDataSelector = require('../../selector/time-block-chart/bar-chart-data');
const RecordTypes = require('../../constants/record-types');
const actions = require('../../actions');
const omit = require('lodash/omit');
const merge = require('lodash/merge');

const TimeBlockWidget = (props) => {
    return (
        <TimeBlockChart {... props}/>
    );
};

const mapStateToProps = (state) => {
    const {timezone = "UTC"} = subjectSelector.currentUser(state) || {};
    const {error, fields} = subjectSelector.dateFilter(RecordTypes.TIME_BLOCK, state);
    const timeBlockPage =  tablePageSelector(state);
    let chartData = barChartDataSelector(state);

    return {
        dateFilter: {
            ... fields,
            error
        },
        paging: omit(timeBlockPage, 'data'),
        barChart: chartData,
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
    const onDelete = (row) => {
        dispatch(actions.async.deleteRecord(RecordTypes.TIME_BLOCK, row.id));
    };

    const onGoToPage = (page) => {
        dispatch(actions.async.goToDatatablePage(RecordTypes.TIME_BLOCK, datasetSelector, page));
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
        onDelete,
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
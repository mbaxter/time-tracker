"use strict";
const React = require('react');
const ReactRedux = require('react-redux');
const UsersTable = require('../presentational/users-table');
const datasetSelector = require('../../selector/users-table/dataset');
const tablePageSelector = require('../../selector/users-table/table-page');
const RecordTypes = require('../../constants/record-types');
const actions = require('../../actions');
const omit = require('lodash/omit');
const merge = require('lodash/merge');

const AppUsersTable = (props) => {
    return (
        <UsersTable {... props}/>
    );
};

const mapStateToProps = (state) => {
    const tablePage =  tablePageSelector(state);

    return {
        paging: omit(tablePage, 'data'),
        data: tablePage.data
    };
};

const mapDispatchToProps = (dispatch) => {
    const onCreate = () => {
        dispatch(actions.async.navigateToPage(`/app/users/create`));
    };
    const onEdit = (row) => {
        dispatch(actions.async.navigateToPage(`/app/users/edit/${row.id}`));
    };
    const onDelete = (row) => {
        dispatch(actions.async.deleteRecord(RecordTypes.USER, row.id));
    };

    const onGoToPage = (page) => {
        dispatch(actions.async.goToDatatablePage(RecordTypes.USER, datasetSelector, page));
    };

    return {
        onCreate,
        onEdit,
        onDelete,
        paging: {onGoToPage}
    };
};

module.exports = ReactRedux.connect(
    mapStateToProps,
    mapDispatchToProps,
    merge
)(AppUsersTable);
"use strict";
const ActionTypes = require('../../constants/action-types');
const uuid = require('node-uuid');
const isArray = require('lodash/isArray');


const SyncActionCreators = {};

// LOGIN / CREDENTIAL RELATED ACTIONS

SyncActionCreators.authorize = (token) => {
    return {
        type: ActionTypes.AUTHORIZE,
        token
    };
};

SyncActionCreators.setCurrentUser = (id) => {
    return {
        type: ActionTypes.SET_CURRENT_USER,
        id
    };
};

SyncActionCreators.clearCredentials = () => {
    return {
        type: ActionTypes.CLEAR_CREDENTIALS
    };
};

// FORMS

SyncActionCreators.updateFormField = (formName, fieldName, fieldValue) => {
    return {
        type: ActionTypes.FORM_FIELD_UPDATE,
        formName,
        fieldName,
        fieldValue
    };
};

SyncActionCreators.clearForm = (formName) => {
    return {
        type: ActionTypes.CLEAR_FORM,
        formName
    };
};

SyncActionCreators.submitForm = (formName) => {
    return {
        type: ActionTypes.FORM_SUBMISSION,
        formName
    };
};

SyncActionCreators.submitFormFailure = (formName, error, fieldErrors = {}) => {
    return {
        type: ActionTypes.FORM_SUBMISSION_FAIL,
        formName,
        error,
        fieldErrors
    };
};

SyncActionCreators.submitFormSuccess = (formName) => {
    return {
        type: ActionTypes.FORM_SUBMISSION_SUCCESS,
        formName
    };
};

// API REQUESTS

SyncActionCreators.initiateRequest = (requestName) => {
    return {
        type: ActionTypes.API_REQUEST_START,
        name: requestName
    };
};

SyncActionCreators.resolveRequest = (requestName) => {
    return {
        type: ActionTypes.API_REQUEST_END,
        name: requestName
    };
};


SyncActionCreators.batchPullStart = (recordType) => {
    return {
        type: ActionTypes.BATCH_PULL_START,
        name: recordType
    };
};

SyncActionCreators.batchPullSuccess = (recordType, batchSize, chunkSize) => {
    return {
        type: ActionTypes.BATCH_PULL_SUCCESS,
        name: recordType,
        finished: chunkSize != batchSize,
        chunkSize
    };
};

SyncActionCreators.batchPullFail = (recordType) => {
    return {
        type: ActionTypes.BATCH_PULL_FAIL,
        name: recordType
    };
};

// RECORDS

SyncActionCreators.appendRecords = (recordType, records) => {
    if (!isArray(records)) {
        records = [records];
    }

    return {
        type: ActionTypes.APPEND_RECORDS,
        recordType,
        records
    };
};

SyncActionCreators.updateRecord = (recordType, id, fields) => {
    return {
        type: ActionTypes.UPDATE_RECORD,
        recordType,
        id,
        fields
    };
};

SyncActionCreators.deleteRecord = (recordType, id) => {
    return {
        type: ActionTypes.DELETE_RECORD,
        recordType,
        id
    };
};

// GLOBAL UI STATE

SyncActionCreators.fadeAlert = (id) => {
    return {
        type: ActionTypes.FADE_ALERT,
        id
    };
};

SyncActionCreators.showAlert = (message, type = ActionTypes.INFO) => {
    return {
        type: ActionTypes.SHOW_ALERT,
        alertType: type,
        message,
        id: uuid.v4()
    };
};

SyncActionCreators.dismissAlert = (id) => {
    return {
        type: ActionTypes.DISMISS_ALERT,
        id
    };
};

SyncActionCreators.showLoader = () => {
    return {
        type: ActionTypes.SHOW_LOADER
    };
};

SyncActionCreators.hideLoader = () => {
    return {
        type: ActionTypes.HIDE_LOADER
    };
};

// DATATABLE

SyncActionCreators.applyDateFilter = (datatableName, from, to) => {
    return {
        type: ActionTypes.DATE_FILTER_APPLY,
        name: datatableName,
        from,
        to
    };
};

SyncActionCreators.applyDateFilterError = (datatableName, error) => {
    return {
        type: ActionTypes.DATE_FILTER_APPLY_ERROR,
        name: datatableName,
        error
    };
};

SyncActionCreators.clearDateFilter = (datatableName) => {
    return {
        type: ActionTypes.DATE_FILTER_CLEAR,
        name: datatableName
    };
};

SyncActionCreators.setDateFilterField = (datatableName, fieldName, fieldValue) => {
    return {
        type: ActionTypes.DATE_FILTER_SET_FIELD,
        name: datatableName,
        fieldName,
        fieldValue
    };
};

module.exports = SyncActionCreators;
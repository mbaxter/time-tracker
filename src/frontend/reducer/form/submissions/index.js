"use strict";
const ActionTypes = require('../../../constants/action-types');
const RequestStatus = require('../../../constants/request-status');

const formSubmission = (state = {status: RequestStatus.NONE, error: "", fieldErrors: {}}, action) => {
    switch (action.type) {
        case ActionTypes.FORM_SUBMISSION:
            return {
                ... state,
                status: RequestStatus.PENDING
            };
        case ActionTypes.FORM_SUBMISSION_SUCCESS:
            return {
                ... state,
                status: RequestStatus.SUCCESSFUL,
                error: "",
                fieldErrors: {}
            };
        case ActionTypes.FORM_SUBMISSION_FAIL:
            return {
                ... state,
                status: RequestStatus.FAILED,
                error: action.error,
                fieldErrors: action.fieldErrors
            };
        case ActionTypes.CLEAR_FORM:
            return {
                ... state,
                error: "",
                fieldErrors: {}
            };
        default:
            return state;
    }
};

const formSubmissions = (state = {}, action) => {
    switch (action.type) {
        case ActionTypes.CLEAR_CREDENTIALS:
            return {};
        case ActionTypes.FORM_SUBMISSION:
        case ActionTypes.FORM_SUBMISSION_FAIL:
        case ActionTypes.FORM_SUBMISSION_SUCCESS:
        case ActionTypes.CLEAR_FORM:
            return {
                ... state,
                [action.formName]: formSubmission(state[action.formName], action)
            };
        default:
            return state;
    }
};

module.exports = formSubmissions;
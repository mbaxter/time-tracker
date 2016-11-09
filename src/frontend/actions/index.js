"use strict";
const ActionTypes = require('../constants/action-types');
const FormNames = require('../constants/form-names');
const RequestStatus = require('../constants/request-status');
const Api = require('../api');
const ModelValidator = require('../../shared/validation/model');
const httpCodes = require('http-status-codes');
const get = require('lodash/get');

const ActionCreators = {};

// UI
ActionCreators.updateFormField = (formName, fieldName, fieldValue) => {
    return {
        type: ActionTypes.FORM_FIELD_UPDATE,
        formName,
        fieldName,
        fieldValue
    };
};

// Form Actions
ActionCreators.submitForm = (formName) => {
    return {
        type: ActionTypes.FORM_SUBMISSION,
        formName
    };
};

ActionCreators.submitFormFailure = (formName, error, fieldErrors = {}) => {
    return {
        type: ActionTypes.FORM_SUBMISSION_FAIL,
        formName,
        error,
        fieldErrors
    };
};

ActionCreators.submitFormSuccess = (formName) => {
    return {
        type: ActionTypes.FORM_SUBMISSION_SUCCESS,
        formName
    };
};

// Authentication / Login
ActionCreators.authorize = (token) => {
    return {
        type: ActionTypes.AUTHORIZE,
        token
    };
};

ActionCreators.deauthorize = () => {
    return {
        type: ActionTypes.DEAUTHORIZE
    };
};

ActionCreators.login = (emailAddress, password) => {
    return (dispatch, getState) => {
        const state = getState();
        const requestStatus = get(state, `request.formSubmissions.${FormNames.LOGIN}.status`, RequestStatus.NONE);
        if (requestStatus == RequestStatus.PENDING) {
            // We've already got a pending login request, don't make another one
            return;
        }

        // Validate input before making network request
        if (!emailAddress || !password) {
            const fieldErrors = {};
            if (!emailAddress) {
                fieldErrors.email_address = "Email address is required.";
            }
            if (!password) {
                fieldErrors.password = "Password is required.";
            }
            // If input is invalid, short-circuit and return a failure immediately
            return dispatch(ActionCreators.submitFormFailure(FormNames.LOGIN, "Required fields are missing.", fieldErrors));
        }

        // Track our new form submission
        dispatch(ActionCreators.submitForm(FormNames.LOGIN));

        // Make api request to log in
        Api.Auth.login(emailAddress, password)
            .then((res) => {
                return res.json().then((json) => {
                    switch(res.status) {
                        case httpCodes.OK:
                            dispatch(ActionCreators.authorize(json.token));
                            dispatch(ActionCreators.submitFormSuccess(FormNames.LOGIN));
                            break;
                        default:
                            dispatch(ActionCreators.submitFormFailure(FormNames.LOGIN, json.error));
                    }
                });
            })
            .catch(() => {
                dispatch(ActionCreators.submitFormFailure(FormNames.LOGIN, "Request failed."));
            });
    };
};

module.exports = ActionCreators;
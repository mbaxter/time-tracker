"use strict";
const ReactRouter = require('react-router');
const ActionTypes = require('../constants/action-types');
const FormNames = require('../constants/form-names');
const RequestStatus = require('../constants/request-status');
const Api = require('../api');
const ModelValidator = require('../../shared/validation/model');
const httpCodes = require('http-status-codes');
const get = require('lodash/get');
const first = require('lodash/first');
const routerHistory = ReactRouter.hashHistory;

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

ActionCreators.showLoader = () => {
    return {
        type: ActionTypes.SHOW_LOADER
    };
};

ActionCreators.hideLoader = () => {
    return {
        type: ActionTypes.HIDE_LOADER
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

// Routing
ActionCreators.navigateToPage = function(url) {
    routerHistory.push(url);
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
        dispatch(ActionCreators.showLoader());
        dispatch(ActionCreators.submitForm(FormNames.LOGIN));

        // Make api request to log in
        Api.Auth.login(emailAddress, password)
            .then((res) => {
                return res.json().then((json) => {
                    switch(res.status) {
                        case httpCodes.OK:
                            dispatch(ActionCreators.authorize(json.token));
                            dispatch(ActionCreators.submitFormSuccess(FormNames.LOGIN));
                            ActionCreators.navigateToPage("/app");
                            break;
                        default:
                            dispatch(ActionCreators.submitFormFailure(FormNames.LOGIN, json.error));
                    }
                    dispatch(ActionCreators.hideLoader());
                });
            })
            .catch(() => {
                dispatch(ActionCreators.submitFormFailure(FormNames.LOGIN, "Request failed."));
                dispatch(ActionCreators.hideLoader());
            });
    };
};

ActionCreators.signup = (record) => {
    return (dispatch, getState) => {
        const state = getState();
        const requestStatus = get(state, `request.formSubmissions.${FormNames.SIGNUP}.status`, RequestStatus.NONE);
        if (requestStatus == RequestStatus.PENDING) {
            // We've already got a pending request, don't make another one
            return;
        }

        // Validate input before making network request
        const validationResponse = ModelValidator.User.validateCreate(record);
        if (!validationResponse.isValid) {
            // If input is invalid, short-circuit and return a failure immediately
            return dispatch(ActionCreators.submitFormFailure(
                FormNames.SIGNUP, validationResponse.error, validationResponse.fieldErrors));
        }

        // Track our new form submission
        dispatch(ActionCreators.showLoader());
        dispatch(ActionCreators.submitForm(FormNames.SIGNUP));

        // Make api request to log in
        Api.Users.insertRecord(record)
            .then((res) => {
                return res.json().then((json) => {
                    const genericError = ActionCreators.submitFormFailure(FormNames.SIGNUP, json.error);
                    let validationError = json.validationErrors ? first(json.validationErrors) : null;
                    switch(res.status) {
                        case httpCodes.CREATED:
                            dispatch(ActionCreators.authorize(json.token));
                            dispatch(ActionCreators.submitFormSuccess(FormNames.SIGNUP));
                            ActionCreators.navigateToPage("/login");
                            break;
                        case httpCodes.BAD_REQUEST:
                            if (validationError) {
                                dispatch(ActionCreators.submitFormFailure(FormNames.SIGNUP, validationError.error, validationError.fieldErrors));
                            } else {
                                dispatch(genericError);
                            }
                            break;
                        default:
                            dispatch(genericError);
                    }
                    dispatch(ActionCreators.hideLoader());
                });
            })
            .catch(() => {
                dispatch(ActionCreators.submitFormFailure(FormNames.SIGNUP, "Request failed."));
                dispatch(ActionCreators.hideLoader());
            });
    };
};

module.exports = ActionCreators;
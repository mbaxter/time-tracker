"use strict";
const ReactRouter = require('react-router');
const ActionTypes = require('../constants/action-types');
const AlertTypes = require('../constants/alert-types');
const uuid = require('node-uuid');
const FormNames = require('../constants/form-names');
const RequestStatus = require('../constants/request-status');
const Api = require('../api');
const ModelValidator = require('../../shared/validation/model');
const get = require('lodash/get');
const first = require('lodash/first');
const routerHistory = ReactRouter.hashHistory;
const noop = require('lodash/noop');
const timeout = require('../util/timeout-promise');

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

ActionCreators.clearForm = (formName) => {
   return {
       type: ActionTypes.CLEAR_FORM,
       formName
   };
};

ActionCreators.showTemporaryAlert = (message, type) => {
    return (dispatch) => {
        const alert = ActionCreators.showAlert(message, type);
        dispatch(alert);
        timeout(4000)
            .then(() => {
                dispatch(ActionCreators.fadeAlert(alert.id));
                return timeout(1000);
            })
            .then(() => {
                dispatch(ActionCreators.dismissAlert(alert.id));
            });
    };
};

ActionCreators.fadeAlert = (id) => {
    return {
        type: ActionTypes.FADE_ALERT,
        id
    };
};

ActionCreators.showAlert = (message, type = ActionTypes.INFO) => {
   return {
       type: ActionTypes.SHOW_ALERT,
       alertType: type,
       message,
       id: uuid.v4()
   };
};

ActionCreators.dismissAlert = (id) => {
    return {
        type: ActionTypes.DISMISS_ALERT,
        id
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

// Form Submissions
ActionCreators.login = (emailAddress, password) => {
    const formAction = () => {
        return Api.Auth.login(emailAddress, password);
    };

    const formValidate = () => {
        if (!emailAddress || !password) {
            const fieldErrors = {};
            if (!emailAddress) {
                fieldErrors.email_address = "Email address is required.";
            }
            if (!password) {
                fieldErrors.password = "Password is required.";
            }
            return {
                isValid: false,
                error: "Required fields are missing.",
                fieldErrors
            };
        }
    };

    const formSuccess = (json, dispatch) => {
        dispatch(ActionCreators.authorize(json.token));
        ActionCreators.navigateToPage("/app");
    };

    return ActionCreators.handleFormSubmission(FormNames.LOGIN, formAction, {formValidate, formSuccess});
};

ActionCreators.signup = (record) => {
    const formAction = () => {
        return Api.Users.insertRecord(record);
    };

    const formValidate = () => {
        return ModelValidator.User.validateCreate(record);
    };

    const formSuccess = (json, dispatch) => {
        dispatch(ActionCreators.clearForm(FormNames.LOGIN));
        dispatch(ActionCreators.updateFormField(FormNames.LOGIN, 'email_address', record.email_address));
        dispatch(ActionCreators.updateFormField(FormNames.LOGIN, 'password', record.password));
        dispatch(ActionCreators.showTemporaryAlert(`New user created: ${record.email_address}.`, AlertTypes.SUCCESS));
        ActionCreators.navigateToPage("/login");
    };

    return ActionCreators.handleFormSubmission(FormNames.SIGNUP, formAction, {formValidate, formSuccess});
};

ActionCreators.handleFormSubmission = (formName, formAction, {formValidate = noop, formSuccess = noop, formFail = noop} = {}) => {
    return (dispatch, getState) => {
        const state = getState();
        const requestStatus = get(state, `request.formSubmissions.${formName}.status`, RequestStatus.NONE);
        if (requestStatus == RequestStatus.PENDING) {
            // We've already got a pending request, don't make another one
            return;
        }

        // Validate input before making network request
        const validationResponse = formValidate();
        if (validationResponse && !validationResponse.isValid) {
            // If input is invalid, short-circuit and return a failure immediately
            return dispatch(ActionCreators.submitFormFailure(
                formName, validationResponse.error, validationResponse.fieldErrors));
        }

        // Track our new form submission
        dispatch(ActionCreators.showLoader());
        dispatch(ActionCreators.submitForm(formName));

        const success = (json) => {
            formSuccess(json, dispatch, getState);
            dispatch(ActionCreators.submitFormSuccess(formName));
            dispatch(ActionCreators.hideLoader());
        };

        const fail = (json = {}, error = "Request failed", fieldErrors = {}) => {
            formFail(json, dispatch, getState);
            dispatch(ActionCreators.submitFormFailure(formName, error, fieldErrors));
            dispatch(ActionCreators.hideLoader());
        };

        // Make api request to log in
        formAction()
            .then((res) => {
                return res.json().then((json) => {
                    let validationError = json.validationErrors ? first(json.validationErrors) : null;
                    if (res.status >= 200 && res.status < 300) {
                        success(json);
                    } else {
                        formFail(dispatch, getState);
                        if (validationError) {
                            fail(json, validationError.error, validationError.fieldErrors);
                        } else {
                            fail(json, json.error);
                        }
                    }
                });
            })
            .catch(() => {
                fail();
            });
    };
};

module.exports = ActionCreators;
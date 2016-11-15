"use strict";
const ReactRouter = require('react-router');
const ActionTypes = require('../constants/action-types');
const AlertTypes = require('../constants/alert-types');
const uuid = require('node-uuid');
const FormNames = require('../constants/form-names');
const RecordTypes = require('../constants/record-types');
const RequestStatus = require('../constants/request-status');
const Api = require('../api');
const ModelValidator = require('../../shared/validation/model');
const get = require('lodash/get');
const first = require('lodash/first');
const routerHistory = ReactRouter.hashHistory;
const noop = require('lodash/noop');
const timeout = require('../util/timeout-promise');
const isArray = require('lodash/isArray');
const httpCodes = require('http-status-codes');
const Promise = require('bluebird');
const error = require('../error');

const apiRetryDelay = 1000;
const batchSize = 1000;

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
ActionCreators.navigateToPage = (url) => {
    routerHistory.push(url);
};

// Records
ActionCreators.appendRecords = (recordType, records) => {
    if (!isArray(records)) {
        records = [records];
    }

    return {
        type: ActionTypes.APPEND_RECORDS,
        recordType,
        records
    };
};

ActionCreators.clearRecords = () => {
    return {
        type: ActionTypes.CLEAR_RECORDS
    };
};

// Request
ActionCreators.initiateRequest = (requestName) => {
    return {
        type: ActionTypes.INITIATE_REQUEST,
        name: requestName
    };
};

ActionCreators.resolveRequest = (requestName) => {
    return {
        type: ActionTypes.RESOLVE_REQUEST,
        name: requestName
    };
};

ActionCreators.startBatchPull = (recordType, batchSize) => {
    return {
        type: ActionTypes.BATCH_PULL_START,
        name: recordType,
        batchSize
    };
};

ActionCreators.batchPullProgress = (recordType, recordCount) => {
    return {
        type: ActionTypes.BATCH_PULL_PROGRESS,
        name: recordType,
        count: recordCount
    };
};

ActionCreators.endBatchPull = (recordType) => {
    return {
        type: ActionTypes.BATCH_PULL_END,
        name: recordType
    };
};

// Fetch
ActionCreators.fetchUserData = () => {
    return (dispatch, getState) => {
        const token = get(getState(), 'credentials.token', null);
        return dispatch(ActionCreators.fetchCurrentUser(token))
            .then(() => {
                return dispatch(ActionCreators.fetchTimeBlocks());
            });
    };
};

ActionCreators.fetchCurrentUser = (userToken, retries = 0) => {
    const requestName = `${ActionTypes.FETCH_CURRENT_USER}-${userToken}`;
    const requestAction = () => {
        return Api.Users.getCurrentUser();
    };
    const onSuccess = (json, dispatch) => {
        dispatch(ActionCreators.appendRecords(RecordTypes.USER, [json.record]));
        dispatch(ActionCreators.setCurrentUser(json.record.id));
        return Promise.resolve(json.record.id);
    };

    return ActionCreators.makeAuthenticatedRequest(requestName, requestAction, {onSuccess, retries});
};

ActionCreators.fetchTimeBlocks = () => {
    const recordType = RecordTypes.TIME_BLOCK;
    return (dispatch, getState) => {
        const offset = 0;
        const userId = get(getState(), 'credentials.userId', null);
        const batchAction = (offset) => {
            return Api.TimeBlocks.getUserRecords(userId, batchSize, offset);
        };
        const onProgress = (json, dispatch) => {
            dispatch(ActionCreators.appendRecords(recordType, json.records));
        };
        return dispatch(ActionCreators.fetchBatches(recordType, batchAction, {onProgress, offset}));
    };
};

ActionCreators.fetchBatches = (recordType, batchAction, {onProgress = noop, offset = 0} = {}) => {
    return (dispatch, getState) => {
        const state = getState();
        const requestName = `batchPull-${recordType}`;
        const requestStatus = get(state, requestName, RequestStatus.NONE);
        if (requestStatus == RequestStatus.PENDING) {
            return Promise.reject(error.DuplicateRequestError.create());
        }
        dispatch(ActionCreators.initiateRequest(requestName));
        dispatch(ActionCreators.startBatchPull(recordType, batchSize));

        let currentOffset = offset;
        const batchRequest = () => {
            return batchAction(currentOffset);
        };
        const onBatchSuccess = (json, dispatch, getState) => {
            const records = json.records;
            const recordCount = records.length;
            currentOffset += recordCount;
            dispatch(ActionCreators.batchPullProgress(requestName, recordCount));
            onProgress(json, dispatch, getState);
            if (recordCount == batchSize) {
                // Pull next batch
                return dispatch(ActionCreators.makeAuthenticatedRequest(`${requestName}-${currentOffset}`, batchRequest, {onSuccess: onBatchSuccess}));
            }
        };

        const resolveBatchRequest = () => {
            dispatch(ActionCreators.resolveRequest(requestName));
            dispatch(ActionCreators.endBatchPull(recordType));
            return Promise.resolve();
        };
        return dispatch(ActionCreators.makeAuthenticatedRequest(`${requestName}-${currentOffset}`, batchRequest, {onSuccess: onBatchSuccess}))
            .then(resolveBatchRequest, resolveBatchRequest);
    };
};

ActionCreators.makeAuthenticatedRequest = (requestName, requestAction, {onSuccess = noop, retries = 0} = {}) => {
    return (dispatch, getState) => {
        const state = getState();
        const token = get(state, 'credentials.token');
        if (!token) {
            return Promise.reject(error.UnauthorizedError.create());
        }

        const isAlreadyFetching = get(state, `pending-requests.${requestName}`,0) > 0;
        if (isAlreadyFetching) {
            return Promise.reject(error.DuplicateRequestError.create());
        }

        dispatch(ActionCreators.initiateRequest(requestName));
        return requestAction()
            .then((res) => {
                if (res.status == httpCodes.OK) {
                    dispatch(ActionCreators.resolveRequest(requestName));
                    return res.json()
                        .then((json) => {
                            return onSuccess(json, dispatch, getState);
                        });
                } else if (res.status == httpCodes.UNAUTHORIZED) {
                    dispatch(ActionCreators.logout());
                    dispatch(ActionCreators.resolveRequest(requestName));
                    return Promise.reject(error.UnauthorizedError.create());
                } else {
                    if (retries > 0) {
                        return timeout(apiRetryDelay)
                            .then(() => {
                                dispatch(ActionCreators.resolveRequest(requestName));
                                return dispatch(ActionCreators.makeAuthenticatedRequest(requestName, requestAction, retries - 1)(dispatch, getState));
                            });
                    }
                    dispatch(ActionCreators.resolveRequest(requestName));
                    return Promise.reject(error.FailedRequestError.create(res.status));
                }
            });
    };
};

// Authentication / Credentials
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

ActionCreators.setCurrentUser = (id) => {
    return {
        type: ActionTypes.SET_CURRENT_USER,
        id
    };
};

ActionCreators.logout = () => {
    return (dispatch) => {
        dispatch(ActionCreators.deauthorize());
        dispatch(ActionCreators.clearRecords());
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
        Api.setAuthToken(json.token);
        ActionCreators.navigateToPage("/app");
        // Clear the form except for email_address
        dispatch(ActionCreators.clearForm(FormNames.LOGIN));
        dispatch(ActionCreators.updateFormField(FormNames.LOGIN, 'email_address', emailAddress));
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
        // Copy credentials to the login page and reroute there
        dispatch(ActionCreators.clearForm(FormNames.LOGIN));
        dispatch(ActionCreators.updateFormField(FormNames.LOGIN, 'email_address', record.email_address));
        dispatch(ActionCreators.updateFormField(FormNames.LOGIN, 'password', record.password));
        ActionCreators.navigateToPage("/login");
        // Show success alert
        dispatch(ActionCreators.showTemporaryAlert(`New user created: ${record.email_address}.`, AlertTypes.SUCCESS));
        // Clear out signup form
        dispatch(ActionCreators.clearForm(FormNames.SIGNUP));
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

        // Make api request
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
"use strict";
const ReactRouter = require('react-router');
const ActionTypes = require('../constants/action-types');
const AlertTypes = require('../constants/alert-types');
const uuid = require('node-uuid');
const FormNames = require('../constants/form-names');
const RecordTypes = require('../constants/record-types');
const RequestStatus = require('../constants/request-status');
const Api = require('../api');
const BatchApi = require('../api/batch-api');
const ModelValidator = require('../../shared/validation/model');
const first = require('lodash/first');
const routerHistory = ReactRouter.hashHistory;
const noop = require('lodash/noop');
const timeout = require('../util/timeout-promise');
const isArray = require('lodash/isArray');
const httpCodes = require('http-status-codes');
const Promise = require('bluebird');
const subject = require('../selector/subject-selector');
const clamp = require('lodash/clamp');
const AppConfig = require('../constants/app-configuration');
const DateFormatter = require('../../shared/datetime/format/date-formatter');
const humanize = require('humanize-string');

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

ActionCreators.goToPage = (tableName, getData, page) => {
    return (dispatch, getState) => {
        const state = getState();
        const data = getData(state);
        const {pageSize = AppConfig.TABLE_PAGING_SIZE} = subject.paging(tableName, state);
        const lastPage = Math.ceil(data.length / pageSize);

        // Make sure page is in bounds
        if(page < 0) {
            // Offset page from the end
            page += (lastPage + 1);
        }
        page = clamp(page, 1, lastPage);

        dispatch({
            type: ActionTypes.PAGING_GO_TO_PAGE,
            name: tableName,
            page
        });
    };
};

ActionCreators.applyDateFilter = (datatableName, from, to) => {
    return {
        type: ActionTypes.DATE_FILTER_APPLY,
        name: datatableName,
        from,
        to
    };
};

ActionCreators.applyDateFilterError = (datatableName, error) => {
    return {
        type: ActionTypes.DATE_FILTER_APPLY_ERROR,
        name: datatableName,
        error
    };
};

ActionCreators.clearDateFilter = (datatableName) => {
    return {
        type: ActionTypes.DATE_FILTER_CLEAR,
        name: datatableName
    };
};

ActionCreators.setDateFilterField = (datatableName, fieldName, fieldValue) => {
    return {
        type: ActionTypes.DATE_FILTER_SET_FIELD,
        name: datatableName,
        fieldName,
        fieldValue
    };
};

ActionCreators.submitDateFilter = (datatableName, formData) => {
    return (dispatch) => {
        // Validate
        let isValid = true;
        let invalidFields = [];
        let missingFields = [];
        let formattedFields = {};
        const validateField = (fieldName) => {
            const value = formData[fieldName];
            if (!value) {
                isValid = false;
                missingFields.push(fieldName);
            } else {
                const normalized = DateFormatter.normalize(value);
                if (!DateFormatter.isValidNormalizedValue(normalized)) {
                    isValid = false;
                    invalidFields.push(fieldName);
                } else {
                    formattedFields[fieldName] = normalized;
                }
            }
        };
        validateField('from');
        validateField('to');

        if (isValid) {
            let switchOrder = formattedFields.from > formattedFields.to;
            let from = switchOrder ? formattedFields.to : formattedFields.from;
            let to = switchOrder ? formattedFields.from : formattedFields.to;
            dispatch(ActionCreators.applyDateFilter(datatableName, from, to));
        } else {
            let error = "";
            if (missingFields.length > 0) {
                error = `Missing fields: ${missingFields.map(humanize).join(', ')}.  `;
            }
            if (invalidFields.length > 0) {
                error += `Invalid fields: ${invalidFields.map(humanize).join(', ')}.`;
            }
            dispatch(ActionCreators.applyDateFilterError(datatableName, error));
        }
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
        type: ActionTypes.API_REQUEST_START,
        name: requestName
    };
};

ActionCreators.resolveRequest = (requestName) => {
    return {
        type: ActionTypes.API_REQUEST_END,
        name: requestName
    };
};

ActionCreators.batchPullStart = (recordType) => {
    return {
        type: ActionTypes.BATCH_PULL_START,
        name: recordType
    };
};

ActionCreators.batchPullSuccess = (recordType, batchSize, chunkSize) => {
    return {
        type: ActionTypes.BATCH_PULL_SUCCESS,
        name: recordType,
        finished: chunkSize != batchSize,
        chunkSize
    };
};

ActionCreators.batchPullFail = (recordType) => {
    return {
        type: ActionTypes.BATCH_PULL_FAIL,
        name: recordType
    };
};

// Fetch
ActionCreators.batchPullIfNecessary = (recordType) => {
    return (dispatch, getState) => {
        // Determine whether we're ready for a pull
        const state = getState();
        const {finished = false, pending = false} = subject.batchPull(recordType, state);
        const userId = subject.currentUserId(state);

        // Start pull only if we're logged in and have a user id, we're not finished pulling and no request is pending
        if (userId && !finished && !pending) {
            return dispatch(ActionCreators.batchPull(recordType));
        }
    };
};

ActionCreators.batchPull = (recordType) => {
    return (dispatch, getState) => {
        const state = getState();
        dispatch(ActionCreators.batchPullStart(recordType));
        const {offset} = subject.batchPull(recordType, state);
        const userId = subject.currentUserId(state);
        BatchApi.pullBatch(recordType, {limit: AppConfig.REQUEST_BATCH_SIZE, offset, userId})
            .then((res) => {
                if (res.status == httpCodes.OK) {
                    return res.json();
                }

                return Promise.reject(res);
            })
            .then((json) => {
                dispatch(ActionCreators.batchPullSuccess(recordType, AppConfig.REQUEST_BATCH_SIZE, json.records.length));
                dispatch(ActionCreators.appendRecords(recordType, json.records));
            })
            .catch((res = {}) => {
                dispatch(ActionCreators.batchPullFail(recordType));
                if (res.status == httpCodes.UNAUTHORIZED) {
                    dispatch(ActionCreators.logout());
                }
            });

    };
};

ActionCreators.fetchAppData = () => {
    return (dispatch) => {
        dispatch(ActionCreators.fetchCurrentUserIfNecessary());
        dispatch(ActionCreators.batchPullIfNecessary(RecordTypes.TIME_BLOCK));
    };
};

ActionCreators.fetchCurrentUserIfNecessary = () => {
    return (dispatch, getState) => {
        const state = getState();
        const userId = subject.currentUserId(state);
        const {pending = false, lastRequestAt = 0} = subject.apiRequest("fetchCurrentUser", state);
        const elapsedTimeSinceLastRequest = Date.now() - lastRequestAt;
        if (!pending && !userId && elapsedTimeSinceLastRequest > AppConfig.REQUEST_RETRY_DELAY) {
            return dispatch(ActionCreators.fetchCurrentUser());
        }
    };
};

ActionCreators.fetchCurrentUser = () => {
    return (dispatch) => {
        dispatch(ActionCreators.initiateRequest('fetchCurrentUser'));
        Api.Users.getCurrentUser()
            .then((res) => {
                if (res.status == httpCodes.OK) {
                    return res.json();
                }

                return Promise.reject(res);
            })
            .then((json) => {
                dispatch(ActionCreators.appendRecords(RecordTypes.USER, [json.record]));
                dispatch(ActionCreators.setCurrentUser(json.record.id));
                dispatch(ActionCreators.resolveRequest('fetchCurrentUser'));
            })
            .catch((res) => {
                dispatch(ActionCreators.resolveRequest('fetchCurrentUser'));
                if (res.status == httpCodes.UNAUTHORIZED) {
                    dispatch(ActionCreators.logout());
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
        const {status = RequestStatus.NONE} = subject.formSubmission(formName, state);
        if (status == RequestStatus.PENDING) {
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
"use strict";
const ReactRouter = require('react-router');
const routerHistory = ReactRouter.hashHistory;
const ActionTypes = require('../../constants/action-types');
const AlertTypes = require('../../constants/alert-types');
const FormNames = require('../../constants/form-names');
const RecordTypes = require('../../constants/record-types');
const RequestStatus = require('../../constants/request-status');
const Api = require('../../api');
const BatchApi = require('../../api/batch-api');
const ModelValidator = require('../../../shared/validation/model');
const first = require('lodash/first');
const noop = require('lodash/noop');
const timeout = require('../../util/timeout-promise');
const httpCodes = require('http-status-codes');
const Promise = require('bluebird');
const subject = require('../../selector/subject-selector');
const clamp = require('lodash/clamp');
const AppConfig = require('../../constants/app-configuration');
const DateFormatter = require('../../../shared/datetime/format/date-formatter');
const humanize = require('humanize-string');
const SyncActionCreators = require('../sync');
const haveCredentialsBeenClearedFactory = require('../../selector/factory/have-credentials-been-cleared');

const AsyncActionCreators = {};


AsyncActionCreators.showTemporaryAlert = (message, type) => {
    return (dispatch) => {
        const alert = SyncActionCreators.showAlert(message, type);
        dispatch(alert);
        timeout(4000)
            .then(() => {
                dispatch(SyncActionCreators.fadeAlert(alert.id));
                return timeout(1000);
            })
            .then(() => {
                dispatch(SyncActionCreators.dismissAlert(alert.id));
            });
    };
};

AsyncActionCreators.goToDatatablePage = (tableName, getData, page) => {
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

AsyncActionCreators.submitDateFilter = (datatableName, formData) => {
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
            dispatch(SyncActionCreators.applyDateFilter(datatableName, from, to));
        } else {
            let error = "";
            if (missingFields.length > 0) {
                error = `Missing fields: ${missingFields.map(humanize).join(', ')}.  `;
            }
            if (invalidFields.length > 0) {
                error += `Invalid fields: ${invalidFields.map(humanize).join(', ')}.`;
            }
            dispatch(SyncActionCreators.applyDateFilterError(datatableName, error));
        }
    };
};

// Fetch
AsyncActionCreators.fetchAppData = () => {
    return (dispatch) => {
        dispatch(AsyncActionCreators.fetchCurrentUserIfNecessary());
        dispatch(AsyncActionCreators.batchPullIfNecessary(RecordTypes.TIME_BLOCK));
    };
};

AsyncActionCreators.batchPullIfNecessary = (recordType) => {
    return (dispatch, getState) => {
        // Determine whether we're ready for a pull
        const state = getState();
        const {finished = false, pending = false} = subject.batchPull(recordType, state);
        const userId = subject.currentUserId(state);

        // Start pull only if we're logged in and have a user id, we're not finished pulling and no request is pending
        if (userId && !finished && !pending) {
            return dispatch(AsyncActionCreators.batchPull(recordType));
        }
    };
};

AsyncActionCreators.batchPull = (recordType) => {
    return (dispatch, getState) => {
        const state = getState();
        dispatch(SyncActionCreators.batchPullStart(recordType));
        const {offset} = subject.batchPull(recordType, state);
        const userId = subject.currentUserId(state);
        const haveCredentialsBeenCleared = haveCredentialsBeenClearedFactory(getState());
        BatchApi.pullBatch(recordType, {limit: AppConfig.REQUEST_BATCH_SIZE, offset, userId})
            .then((res) => {
                if (res.status == httpCodes.OK) {
                    return res.json();
                }

                return Promise.reject(res);
            })
            .then((json) => {
                if (haveCredentialsBeenCleared(getState())) {
                    return;
                }
                dispatch(SyncActionCreators.batchPullSuccess(recordType, AppConfig.REQUEST_BATCH_SIZE, json.records.length));
                dispatch(SyncActionCreators.appendRecords(recordType, json.records));
            })
            .catch((res = {}) => {
                if (haveCredentialsBeenCleared(getState())) {
                    return;
                }
                dispatch(SyncActionCreators.batchPullFail(recordType));
                if (res.status == httpCodes.UNAUTHORIZED) {
                    dispatch(AsyncActionCreators.logout());
                }
            });

    };
};

AsyncActionCreators.fetchCurrentUserIfNecessary = () => {
    return (dispatch, getState) => {
        const state = getState();
        const userId = subject.currentUserId(state);
        const {pending = false, lastRequestAt = 0} = subject.apiRequest("fetchCurrentUser", state);
        const elapsedTimeSinceLastRequest = Date.now() - lastRequestAt;
        if (!pending && !userId && elapsedTimeSinceLastRequest > AppConfig.REQUEST_RETRY_DELAY) {
            return dispatch(AsyncActionCreators.fetchCurrentUser());
        }
    };
};

AsyncActionCreators.fetchCurrentUser = () => {
    return (dispatch, getState) => {
        dispatch(SyncActionCreators.initiateRequest('fetchCurrentUser'));
        const haveCredentialsBeenCleared = haveCredentialsBeenClearedFactory(getState());
        Api.Users.getCurrentUser()
            .then((res) => {
                if (res.status == httpCodes.OK) {
                    return res.json();
                }

                return Promise.reject(res);
            })
            .then((json) => {
                if (haveCredentialsBeenCleared(getState())){
                    return;
                }
                dispatch(SyncActionCreators.appendRecords(RecordTypes.USER, [json.record]));
                dispatch(SyncActionCreators.setCurrentUser(json.record.id));
                dispatch(SyncActionCreators.resolveRequest('fetchCurrentUser'));
            })
            .catch((res) => {
                dispatch(SyncActionCreators.resolveRequest('fetchCurrentUser'));
                if (haveCredentialsBeenCleared(getState())){
                    return;
                }
                if (res.status == httpCodes.UNAUTHORIZED) {
                    dispatch(AsyncActionCreators.logout());
                }
            });
    };
};

AsyncActionCreators.logout = () => {
    return (dispatch) => {
        dispatch(SyncActionCreators.clearCredentials());
    };
};

// Form Submissions
AsyncActionCreators.login = (emailAddress, password) => {
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
        // Make sure any previous data is cleared out first
        dispatch(SyncActionCreators.clearCredentials());
        dispatch(SyncActionCreators.authorize(json.token));
        Api.setAuthToken(json.token);
        dispatch(AsyncActionCreators.navigateToPage("/app"));
        // Clear the login form except for email_address
        dispatch(SyncActionCreators.updateFormField(FormNames.LOGIN, 'email_address', emailAddress));
    };

    return AsyncActionCreators.handleFormSubmission(FormNames.LOGIN, formAction, {formValidate, formSuccess});
};

AsyncActionCreators.signup = (record) => {
    const formAction = () => {
        return Api.Users.insertRecord(record);
    };

    const formValidate = () => {
        return ModelValidator.User.validateCreate(record);
    };

    const formSuccess = (json, dispatch) => {
        // Copy credentials to the login page and reroute there
        dispatch(SyncActionCreators.clearForm(FormNames.LOGIN));
        dispatch(SyncActionCreators.updateFormField(FormNames.LOGIN, 'email_address', record.email_address));
        dispatch(SyncActionCreators.updateFormField(FormNames.LOGIN, 'password', record.password));
        dispatch(AsyncActionCreators.navigateToPage("/login"));
        // Show success alert
        dispatch(AsyncActionCreators.showTemporaryAlert(`New user created: ${record.email_address}.`, AlertTypes.SUCCESS));
        // Clear out signup form
        dispatch(SyncActionCreators.clearForm(FormNames.SIGNUP));
    };

    return AsyncActionCreators.handleFormSubmission(FormNames.SIGNUP, formAction, {formValidate, formSuccess});
};

AsyncActionCreators.editTimeBlock = (id, fields) => {
    const formAction = () => {
        return Api.TimeBlocks.updateRecord(id, fields);
    };

    const formValidate = () => {
        return ModelValidator.TimeBlock.validateUpdate(fields);
    };

    const formSuccess = (json, dispatch) => {
        // Copy credentials to the login page and reroute there
        dispatch(SyncActionCreators.updateRecord(RecordTypes.TIME_BLOCK, id, fields));
        dispatch(SyncActionCreators.clearForm(FormNames.TIME_BLOCK_EDIT));
        dispatch(AsyncActionCreators.navigateToPage("/app/time-blocks"));
    };

    return AsyncActionCreators.handleFormSubmission(FormNames.TIME_BLOCK_EDIT, formAction, {formValidate, formSuccess});
};

AsyncActionCreators.handleFormSubmission = (formName, formAction, {formValidate = noop, formSuccess = noop, formFail = noop} = {}) => {
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
            return dispatch(SyncActionCreators.submitFormFailure(
                formName, validationResponse.error, validationResponse.fieldErrors));
        }

        // Track our new form submission
        dispatch(SyncActionCreators.showLoader());
        dispatch(SyncActionCreators.submitForm(formName));

        const success = (json) => {
            formSuccess(json, dispatch, getState);
            dispatch(SyncActionCreators.submitFormSuccess(formName));
            dispatch(SyncActionCreators.hideLoader());
        };

        const fail = (json = {}, error = "Request failed", fieldErrors = {}) => {
            formFail(json, dispatch, getState);
            dispatch(SyncActionCreators.submitFormFailure(formName, error, fieldErrors));
            dispatch(SyncActionCreators.hideLoader());
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

// ROUTING
AsyncActionCreators.navigateToPage = (url) => {
    return () => {
        routerHistory.push(url);
    };
};

module.exports = AsyncActionCreators;
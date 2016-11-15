"use strict";
const get = require('lodash/get');
const curry = require('lodash/curry');
const RecordTypes = require('../../constants/record-types');
const RequestStatus = require('../../constants/request-status');

const SubjectSelectors = {};

SubjectSelectors.alerts = (state) => {
    return get(state, "ui.alerts", {});
};

SubjectSelectors.authenticated = (state) => {
    return get(state, 'credentials.authenticated', false);
};

SubjectSelectors.batchPull = curry((recordType, state) => {
    return get(state, `request.batchPull.${recordType}`, {pending: false, offset: 0, finished: false, lastPulled: 0});
});

SubjectSelectors.formFields = (formName, state) => {
    return get(state, `ui.formFields.${formName}`, {});
};

SubjectSelectors.formSubmission = curry((formName, state) => {
    return get(state, `request.formSubmissions.${formName}`, {status: RequestStatus.NONE, error: "", fieldErrors: {}});
});

SubjectSelectors.loaderRequests = (state) => {
    return get(state, 'ui.loader.requests', 0);
};

SubjectSelectors.singletonRequest = curry((requestName, state) => {
    return get(state, `request.singleton.${requestName}`, {pending: false, lastRequestAt: 0});
});

SubjectSelectors.records = curry(
    (type, state) => {
        return get(state, `records.${type}`, []);
    }
);

SubjectSelectors.timeBlocks = SubjectSelectors.records(RecordTypes.TIME_BLOCK);
SubjectSelectors.users = SubjectSelectors.records(RecordTypes.USER);

SubjectSelectors.token = (state) => {
    return get(state, 'credentials.token');
};

SubjectSelectors.currentUserId = (state) => {
   return get(state, 'credentials.userId');
};

SubjectSelectors.currentUser = (state) => {
    const userId = SubjectSelectors.currentUserId(state);
    const users = SubjectSelectors.users(state) || {};
    return (userId && users) ? users[userId] : undefined;
};


module.exports = SubjectSelectors;
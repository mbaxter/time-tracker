"use strict";
const get = require('lodash/get');
const curry = require('lodash/curry');
const RecordTypes = require('../../constants/record-types');
const RequestStatus = require('../../constants/request-status');
const AppConfig = require('../../constants/app-configuration');

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

SubjectSelectors.currentUser = (state) => {
    const userId = SubjectSelectors.currentUserId(state);
    const users = SubjectSelectors.users(state) || {};
    return (userId && users) ? users[userId] : undefined;
};

SubjectSelectors.currentUserId = (state) => {
    return get(state, 'credentials.userId');
};

SubjectSelectors.formFields = (formName, state) => {
    return get(state, `ui.formFields.${formName}`, {});
};

SubjectSelectors.formSubmission = curry((formName, state) => {
    return get(state, `request.formSubmissions.${formName}`, {status: RequestStatus.NONE, error: "", fieldErrors: {}});
});

SubjectSelectors.loaderRequests = (state) => {
    return get(state, 'ui.loader.requests', 0);
};

SubjectSelectors.paging = curry((tableName, state) => {
   return get(state, `ui.paging.${tableName}`, {offset: 0, pageSize: AppConfig.TABLE_PAGING_SIZE});
});

SubjectSelectors.records = curry(
    (type, state) => {
        return get(state, `records.${type}`, []);
    }
);

SubjectSelectors.singletonRequest = curry((requestName, state) => {
    return get(state, `request.singleton.${requestName}`, {pending: false, lastRequestAt: 0});
});

SubjectSelectors.timeBlocks = SubjectSelectors.records(RecordTypes.TIME_BLOCK);

SubjectSelectors.token = (state) => {
    return get(state, 'credentials.token');
};

SubjectSelectors.users = SubjectSelectors.records(RecordTypes.USER);

module.exports = SubjectSelectors;
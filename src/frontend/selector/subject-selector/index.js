"use strict";
const get = require('lodash/get');
const curry = require('lodash/curry');
const RecordTypes = require('../../constants/record-types');
const RequestStatus = require('../../constants/request-status');
const AppConfig = require('../../constants/app-configuration');

const SubjectSelectors = {};

SubjectSelectors.alerts = (state) => {
    return get(state, "global.alerts", {});
};

SubjectSelectors.authenticated = (state) => {
    return get(state, 'credentials.authenticated', false);
};

SubjectSelectors.batchPull = curry((recordType, state) => {
    return get(state, `api.batchPull.${recordType}`, {pending: false, offset: 0, finished: false, lastPulled: 0});
});

SubjectSelectors.currentUser = (state) => {
    const userId = SubjectSelectors.currentUserId(state);
    const users = SubjectSelectors.users(state) || {};
    return (userId && users) ? users[userId] : undefined;
};

SubjectSelectors.currentUserId = (state) => {
    return get(state, 'credentials.userId');
};

SubjectSelectors.clearedCredentialsCount = (state) => {
   return get(state, `credentials.cleared`, 0);
};

SubjectSelectors.dateFilter = curry((datatableName, state) => {
    return get(state, `datatable.filter.date.${datatableName}`, {filter: {}, fields: {}, error: ""});
});

SubjectSelectors.dateFilterValue = curry((datatableName, state) => {
    return get(state, `datatable.filter.date.${datatableName}.filter`, {});
});

SubjectSelectors.formFields = (formName, state) => {
    return get(state, `form.fields.${formName}`, {});
};

SubjectSelectors.formSubmission = curry((formName, state) => {
    return get(state, `form.submissions.${formName}`, {status: RequestStatus.NONE, error: "", fieldErrors: {}});
});

SubjectSelectors.loaderRequests = (state) => {
    return get(state, 'global.loader.requests', 0);
};

SubjectSelectors.paging = curry((tableName, state) => {
   return get(state, `datatable.paging.${tableName}`, {offset: 0, pageSize: AppConfig.TABLE_PAGING_SIZE});
});

SubjectSelectors.records = curry(
    (type, state) => {
        return get(state, `records.${type}`, []);
    }
);

SubjectSelectors.apiRequest = curry((requestName, state) => {
    return get(state, `api.request.${requestName}`, {pending: false, lastRequestAt: 0});
});

SubjectSelectors.timeBlocks = SubjectSelectors.records(RecordTypes.TIME_BLOCK);

SubjectSelectors.timezone = () => {
    let user = SubjectSelectors.currentUser();
    return user ? user.timezone : 'UTC';
};

SubjectSelectors.token = (state) => {
    return get(state, 'credentials.token');
};

SubjectSelectors.users = SubjectSelectors.records(RecordTypes.USER);

module.exports = SubjectSelectors;
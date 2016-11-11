"use strict";
const ActionTypes = {
    // LOGIN / CREDENTIAL RELATED ACTIONS
    LOGIN: "LOGIN",
    AUTHORIZE: "AUTHORIZE",
    DEAUTHORIZE: "DEAUTHORIZE",
    // FORMS
    FORM_FIELD_UPDATE: "FORM_FIELD_UPDATE",
    CLEAR_FORM: "CLEAR_FORM",
    FORM_SUBMISSION: 'FORM_SUBMISSION',
    FORM_SUBMISSION_FAIL: 'FORM_SUBMISSION_FAIL',
    FORM_SUBMISSION_SUCCESS: 'FORM_SUBMISSION_SUCCESS',
    // UI
    SHOW_LOADER: "SHOW_LOADER",
    HIDE_LOADER: "HIDE_LOADER",
    SHOW_ALERT: "SHOW_ALERT",
    DISMISS_ALERT: "DISMISS_ALERT",
    FADE_ALERT: "FADE_ALERT"
};

module.exports = ActionTypes;
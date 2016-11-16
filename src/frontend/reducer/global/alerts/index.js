"use strict";
const ActionTypes = require('../../../constants/action-types');
const AlertTypes = require('../../../constants/alert-types');
const omit = require('lodash/omit');

const alert = (state = {}, action) => {
    switch (action.type) {
        case ActionTypes.SHOW_ALERT:
            return {
                id: action.id,
                type: action.alertType || AlertTypes.INFO,
                message: action.message,
                fade: false,
                created: Date.now()
            };
        case ActionTypes.FADE_ALERT:
            return {
                ... state,
                fade: true
            };
        default:
            return state;
    }
};

const alerts = (state = {}, action) => {
    switch (action.type) {
        case ActionTypes.SHOW_ALERT:
        case ActionTypes.FADE_ALERT:
            return {
                ... state,
                [action.id]: alert(state[action.id], action)
            };
        case ActionTypes.DISMISS_ALERT:
            return omit(state, action.id);
        default:
            return state;
    }
};

module.exports = alerts;
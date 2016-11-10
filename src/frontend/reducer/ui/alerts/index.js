"use strict";
const ActionTypes = require('../../../constants/action-types');
const AlertTypes = require('../../../constants/alert-types');
const omit = require('lodash/omit');

const alerts = (state = {}, action) => {
    switch (action.type) {
        case ActionTypes.SHOW_ALERT:
            return {
                ... state,
                [action.id]: {
                    id: action.id,
                    type: action.alertType || AlertTypes.INFO,
                    message: action.message,
                    created: Date.now()
                }
            };
        case ActionTypes.DISMISS_ALERT:
            return omit(state, action.id);
        default:
            return state;
    }
};

module.exports = alerts;